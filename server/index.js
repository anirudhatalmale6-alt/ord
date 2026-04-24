require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const path = require('path');
const crypto = require('crypto');
const db = require('./db');

const PORT = parseInt(process.env.PORT, 10) || 3025;
const BASE_PATH = process.env.BASE_PATH || '/ord';
const JWT_SECRET = process.env.JWT_SECRET || 'ord_default_secret';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID || '';
const AI_API_KEY = process.env.AI_API_KEY || '';

const app = express();
const router = express.Router();

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(compression());

// Stripe webhook needs raw body
app.use(BASE_PATH + '/api/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(BASE_PATH, express.json({ limit: '1mb' }));
app.use(BASE_PATH, express.urlencoded({ extended: true }));
app.use(BASE_PATH, express.static(path.join(__dirname, '..', 'public')));
app.use(BASE_PATH, router);

// Auth middleware
function auth(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Free tier: 20 checks/day. Pro: unlimited.
const FREE_DAILY_LIMIT = 20;

function checkRateLimit(userId) {
  const user = db.prepare('SELECT plan, api_calls_today, api_calls_reset FROM users WHERE id = ?').get(userId);
  if (!user) return { allowed: false, reason: 'User not found' };
  if (user.plan === 'pro') return { allowed: true };

  const today = new Date().toISOString().split('T')[0];
  if (user.api_calls_reset !== today) {
    db.prepare('UPDATE users SET api_calls_today = 0, api_calls_reset = ? WHERE id = ?').run(today, userId);
    return { allowed: true, remaining: FREE_DAILY_LIMIT };
  }

  if (user.api_calls_today >= FREE_DAILY_LIMIT) {
    return { allowed: false, reason: `Free plan limit reached (${FREE_DAILY_LIMIT}/day). Upgrade to Pro for unlimited.`, remaining: 0 };
  }

  return { allowed: true, remaining: FREE_DAILY_LIMIT - user.api_calls_today };
}

// ─── Auth Routes ───
router.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(400).json({ error: 'Email already registered' });

  const id = uuid();
  const hash = bcrypt.hashSync(password, 10);
  const apiKey = 'ord_' + crypto.randomBytes(24).toString('hex');
  db.prepare('INSERT INTO users (id, email, password, name, api_key) VALUES (?, ?, ?, ?, ?)').run(id, email, hash, name || '', apiKey);

  const token = jwt.sign({ id, email, plan: 'free' }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user: { id, email, name: name || '', plan: 'free', api_key: apiKey } });
});

router.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, plan: user.plan }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, plan: user.plan, api_key: user.api_key } });
});

router.get('/api/auth/me', auth, (req, res) => {
  const user = db.prepare('SELECT id, email, name, plan, api_key, api_calls_today, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const today = new Date().toISOString().split('T')[0];
  const calls = db.prepare('SELECT api_calls_today, api_calls_reset FROM users WHERE id = ?').get(req.user.id);
  user.remaining_calls = user.plan === 'pro' ? -1 : Math.max(0, FREE_DAILY_LIMIT - (calls.api_calls_reset === today ? calls.api_calls_today : 0));
  res.json({ user });
});

// ─── API Key check (for extension) ───
router.post('/api/validate-key', (req, res) => {
  const { api_key } = req.body;
  if (!api_key) return res.status(400).json({ error: 'API key required' });
  const user = db.prepare('SELECT id, plan, api_calls_today, api_calls_reset FROM users WHERE api_key = ?').get(api_key);
  if (!user) return res.status(401).json({ error: 'Invalid API key' });
  const limit = checkRateLimit(user.id);
  res.json({ valid: true, plan: user.plan, ...limit });
});

// ─── User dashboard ───
router.get('/api/usage', auth, (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const stats = db.prepare(`
    SELECT date(created_at) as day, COUNT(*) as checks, SUM(chars_checked) as chars, language
    FROM api_usage WHERE user_id = ? AND created_at >= datetime('now', '-' || ? || ' days')
    GROUP BY day, language ORDER BY day DESC
  `).all(req.user.id, days);

  const totals = db.prepare(`
    SELECT COUNT(*) as total_checks, SUM(chars_checked) as total_chars
    FROM api_usage WHERE user_id = ?
  `).get(req.user.id);

  const langStats = db.prepare(`
    SELECT language, COUNT(*) as count FROM api_usage WHERE user_id = ? GROUP BY language ORDER BY count DESC
  `).all(req.user.id);

  res.json({ stats, totals, langStats });
});

router.put('/api/profile', auth, (req, res) => {
  const { name, password } = req.body;
  if (name !== undefined) db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name, req.user.id);
  if (password) db.prepare('UPDATE users SET password = ? WHERE id = ?').run(bcrypt.hashSync(password, 10), req.user.id);
  const user = db.prepare('SELECT id, email, name, plan, api_key FROM users WHERE id = ?').get(req.user.id);
  res.json({ user });
});

router.post('/api/regenerate-key', auth, (req, res) => {
  const newKey = 'ord_' + crypto.randomBytes(24).toString('hex');
  db.prepare('UPDATE users SET api_key = ? WHERE id = ?').run(newKey, req.user.id);
  res.json({ api_key: newKey });
});

// ─── Stripe Subscription ───
router.post('/api/create-checkout', auth, (req, res) => {
  if (!STRIPE_SECRET_KEY || !STRIPE_PRICE_ID) {
    return res.status(400).json({ error: 'Stripe is not configured' });
  }
  const stripe = require('stripe')(STRIPE_SECRET_KEY);
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);

  (async () => {
    try {
      let customerId = user.stripe_customer_id;
      if (!customerId) {
        const customer = await stripe.customers.create({ email: user.email, name: user.name });
        customerId = customer.id;
        db.prepare('UPDATE users SET stripe_customer_id = ? WHERE id = ?').run(customerId, user.id);
      }

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
        mode: 'subscription',
        success_url: process.env.APP_URL + '/#dashboard?upgraded=1',
        cancel_url: process.env.APP_URL + '/#pricing'
      });

      res.json({ url: session.url });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  })();
});

router.post('/api/stripe/webhook', (req, res) => {
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) return res.sendStatus(400);
  const stripe = require('stripe')(STRIPE_SECRET_KEY);
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], STRIPE_WEBHOOK_SECRET);
  } catch {
    return res.sendStatus(400);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    if (session.customer) {
      db.prepare('UPDATE users SET plan = ?, stripe_subscription_id = ? WHERE stripe_customer_id = ?')
        .run('pro', session.subscription, session.customer);
    }
  } else if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object;
    db.prepare('UPDATE users SET plan = ? WHERE stripe_subscription_id = ?').run('free', sub.id);
  }

  res.sendStatus(200);
});

router.post('/api/cancel-subscription', auth, (req, res) => {
  if (!STRIPE_SECRET_KEY) return res.status(400).json({ error: 'Stripe not configured' });
  const user = db.prepare('SELECT stripe_subscription_id FROM users WHERE id = ?').get(req.user.id);
  if (!user?.stripe_subscription_id) return res.status(400).json({ error: 'No active subscription' });

  const stripe = require('stripe')(STRIPE_SECRET_KEY);
  (async () => {
    try {
      await stripe.subscriptions.cancel(user.stripe_subscription_id);
      db.prepare('UPDATE users SET plan = ?, stripe_subscription_id = NULL WHERE id = ?').run('free', req.user.id);
      res.json({ message: 'Subscription cancelled' });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  })();
});

// ─── Newsletter ───
router.post('/api/newsletter', (req, res) => {
  const { email, name } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  try {
    db.prepare('INSERT OR IGNORE INTO newsletter (email, name) VALUES (?, ?)').run(email, name || '');
    res.json({ message: 'Subscribed!' });
  } catch {
    res.json({ message: 'Already subscribed' });
  }
});

// ─── Track API usage ───
router.post('/api/track', auth, (req, res) => {
  const { language, chars_checked, endpoint } = req.body;
  db.prepare('INSERT INTO api_usage (user_id, endpoint, language, chars_checked) VALUES (?, ?, ?, ?)').run(req.user.id, endpoint || 'check', language || 'sv', chars_checked || 0);
  db.prepare('UPDATE users SET api_calls_today = api_calls_today + 1 WHERE id = ?').run(req.user.id);
  res.json({ ok: true });
});

// ─── Chatbot ───
router.post('/api/chatbot', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });
  if (!AI_API_KEY) return res.json({ reply: 'Chatbot is not configured yet. Please contact support.' });

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': AI_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 512,
        system: `You are the Ord AI assistant on the Ord website (skylarkmedia.se/ord). Ord is an AI-powered grammar and spell checker that works as a Chrome browser extension.

Key facts about Ord:
- Supports 23+ languages including Swedish, English, Norwegian, Danish, Finnish, German, French, Spanish, Italian, Portuguese, Dutch, Polish, Urdu, Hindi, Punjabi, Dari, Pahari, Arabic, Chinese, Japanese, Korean, Russian, Turkish
- Free plan: 20 grammar checks per day, all languages
- Pro plan: $5/month, unlimited checks, rephrase/tone tools, priority processing
- Works on any website in any text field (Gmail, Google Docs, social media, forms)
- AI-powered (not rule-based like traditional grammar checkers)
- Features: grammar check, spell check, style/tone suggestions, rephrase (formal/casual/concise)
- Keyboard shortcut: Ctrl+Shift+G
- Right-click context menu integration
- Privacy first: text is processed and never stored
- Special support for Pahari language with custom font

Be helpful, concise, and friendly. Answer in the same language the user writes in. Keep responses under 3 sentences when possible.`,
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await resp.json();
    if (data.content && data.content[0]) {
      return res.json({ reply: data.content[0].text });
    }
    res.json({ reply: 'Sorry, I could not process that right now. Please try again.' });
  } catch (err) {
    console.error('[chatbot]', err.message);
    res.json({ reply: 'Something went wrong. Please try again later.' });
  }
});

// Fallback SPA
router.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[Ord] Server running on port ${PORT}`);
  console.log(`[Ord] Base path: ${BASE_PATH}`);
});
