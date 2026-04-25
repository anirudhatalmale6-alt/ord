require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const path = require('path');
const crypto = require('crypto');
const db = require('./db');

const PORT = parseInt(process.env.PORT, 10) || 3025;
const BASE_PATH = process.env.BASE_PATH || '/ord';
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET required');
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID || '';
const AI_API_KEY = process.env.AI_API_KEY || '';

const app = express();
const router = express.Router();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["fonts.gstatic.com"],
      connectSrc: ["'self'"],
      imgSrc: ["'self'", "data:"]
    }
  },
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors({ origin: ['https://skylarkmedia.se'], credentials: true }));

// Rate limiters
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { error: 'Too many registration attempts. Please try again in an hour.' },
  standardHeaders: true,
  legacyHeaders: false
});

const chatbotLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many requests. Please wait a moment before trying again.' },
  standardHeaders: true,
  legacyHeaders: false
});

const newsletterLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many subscription attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

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

function adminOnly(req, res, next) {
  const user = db.prepare('SELECT role FROM users WHERE id = ?').get(req.user.id);
  if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  next();
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
router.post('/api/auth/register', registerLimiter, (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email format' });

  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(400).json({ error: 'Email already registered' });

  const id = uuid();
  const hash = bcrypt.hashSync(password, 10);
  const apiKey = 'ord_' + crypto.randomBytes(24).toString('hex');
  db.prepare('INSERT INTO users (id, email, password, name, api_key) VALUES (?, ?, ?, ?, ?)').run(id, email, hash, name || '', apiKey);

  const token = jwt.sign({ id, email, plan: 'free' }, JWT_SECRET, { expiresIn: '30d' });
  const maskedKey = '****' + apiKey.slice(-4);
  res.json({ token, user: { id, email, name: name || '', plan: 'free', api_key: maskedKey } });
});

router.post('/api/auth/login', loginLimiter, (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, plan: user.plan }, JWT_SECRET, { expiresIn: '30d' });
  const maskedKey = user.api_key ? '****' + user.api_key.slice(-4) : null;
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, plan: user.plan, api_key: maskedKey } });
});

router.get('/api/auth/me', auth, (req, res) => {
  const user = db.prepare('SELECT id, email, name, role, plan, api_key, api_calls_today, created_at FROM users WHERE id = ?').get(req.user.id);
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

router.get('/api/writing-stats', auth, (req, res) => {
  const userId = req.user.id;

  const totals = db.prepare(`
    SELECT COUNT(*) as total_checks, COALESCE(SUM(chars_checked), 0) as total_chars,
    COUNT(DISTINCT date(created_at)) as active_days
    FROM api_usage WHERE user_id = ?
  `).get(userId);

  const byEndpoint = db.prepare(`
    SELECT endpoint, COUNT(*) as count FROM api_usage WHERE user_id = ? GROUP BY endpoint
  `).all(userId);

  const byLanguage = db.prepare(`
    SELECT language, COUNT(*) as count FROM api_usage WHERE user_id = ? GROUP BY language ORDER BY count DESC
  `).all(userId);

  const last7days = db.prepare(`
    SELECT date(created_at) as day, COUNT(*) as checks, COALESCE(SUM(chars_checked), 0) as chars
    FROM api_usage WHERE user_id = ? AND created_at >= datetime('now', '-7 days')
    GROUP BY day ORDER BY day
  `).all(userId);

  const last30days = db.prepare(`
    SELECT date(created_at) as day, COUNT(*) as checks
    FROM api_usage WHERE user_id = ? AND created_at >= datetime('now', '-30 days')
    GROUP BY day ORDER BY day
  `).all(userId);

  const today = db.prepare(`
    SELECT COUNT(*) as checks, COALESCE(SUM(chars_checked), 0) as chars
    FROM api_usage WHERE user_id = ? AND date(created_at) = date('now')
  `).get(userId);

  const streak = calculateStreak(userId);

  res.json({ totals, byEndpoint, byLanguage, last7days, last30days, today, streak });
});

function calculateStreak(userId) {
  const days = db.prepare(`
    SELECT DISTINCT date(created_at) as day FROM api_usage WHERE user_id = ? ORDER BY day DESC LIMIT 60
  `).all(userId).map(r => r.day);

  if (!days.length) return 0;

  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (days[0] !== today && days[0] !== yesterday) return 0;

  let expected = new Date(days[0]);
  for (const day of days) {
    const d = new Date(day);
    if (d.toISOString().split('T')[0] === expected.toISOString().split('T')[0]) {
      streak++;
      expected = new Date(expected.getTime() - 86400000);
    } else {
      break;
    }
  }
  return streak;
}

router.put('/api/profile', auth, (req, res) => {
  const { name, password } = req.body;
  if (name !== undefined) db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name, req.user.id);
  if (password) {
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(bcrypt.hashSync(password, 10), req.user.id);
  }
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
      console.error('[create-checkout]', e.message);
      res.status(500).json({ error: 'Internal server error' });
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
      console.error('[cancel-subscription]', e.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  })();
});

// ─── Newsletter ───
router.post('/api/newsletter', newsletterLimiter, (req, res) => {
  const { email, name } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email format' });

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

// ─── Admin ───
router.get('/api/admin/users', auth, adminOnly, (req, res) => {
  const users = db.prepare('SELECT id, email, name, role, plan, api_calls_today, created_at FROM users ORDER BY created_at DESC').all();
  res.json({ users });
});

router.post('/api/admin/users', auth, adminOnly, (req, res) => {
  const { email, password, name, role, plan } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(400).json({ error: 'Email already exists' });
  const id = uuid();
  const hash = bcrypt.hashSync(password, 10);
  const apiKey = 'ord_' + crypto.randomBytes(24).toString('hex');
  db.prepare('INSERT INTO users (id, email, password, name, role, plan, api_key) VALUES (?, ?, ?, ?, ?, ?, ?)').run(id, email, hash, name || '', role || 'user', plan || 'free', apiKey);
  res.json({ user: { id, email, name: name || '', role: role || 'user', plan: plan || 'free' } });
});

router.put('/api/admin/users/:id', auth, adminOnly, (req, res) => {
  const { name, email, role, plan, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (name !== undefined) db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name, req.params.id);
  if (email) db.prepare('UPDATE users SET email = ? WHERE id = ?').run(email, req.params.id);
  if (role) db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, req.params.id);
  if (plan) db.prepare('UPDATE users SET plan = ? WHERE id = ?').run(plan, req.params.id);
  if (password) db.prepare('UPDATE users SET password = ? WHERE id = ?').run(bcrypt.hashSync(password, 10), req.params.id);
  res.json({ message: 'User updated' });
});

router.delete('/api/admin/users/:id', auth, adminOnly, (req, res) => {
  if (req.params.id === req.user.id) return res.status(400).json({ error: 'Cannot delete your own account' });
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.json({ message: 'User deleted' });
});

router.get('/api/admin/stats', auth, adminOnly, (req, res) => {
  const totalUsers = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
  const proUsers = db.prepare("SELECT COUNT(*) as c FROM users WHERE plan = 'pro'").get().c;
  const totalChecks = db.prepare('SELECT COUNT(*) as c FROM api_usage').get().c;
  const todayChecks = db.prepare("SELECT COUNT(*) as c FROM api_usage WHERE date(created_at) = date('now')").get().c;
  res.json({ totalUsers, proUsers, totalChecks, todayChecks });
});

// ─── Web Editor API (JWT auth, for dashboard writer) ───
router.post('/api/editor/check', auth, async (req, res) => {
  const { text, language } = req.body;
  if (!text || text.trim().length < 2) return res.status(400).json({ error: 'Text required' });
  if (text.length > 10000) return res.status(400).json({ error: 'Text too long. Maximum 10,000 characters.' });
  if (!AI_API_KEY) return res.status(500).json({ error: 'AI service not configured' });

  const limit = checkRateLimit(req.user.id);
  if (!limit.allowed) return res.status(429).json({ error: limit.reason });

  const langName = LANG_NAMES[language] || language || 'English';
  const systemPrompt = `You are a professional ${langName} grammar and spelling checker. Analyze the text and return a JSON response with this exact structure:
{
  "corrected": "the full corrected text",
  "issues": [
    {
      "type": "grammar|spelling|punctuation|style",
      "original": "the wrong part",
      "suggestion": "the corrected part",
      "explanation": "brief explanation in ${langName}"
    }
  ],
  "score": 85
}

Rules:
- "corrected" must contain the full text with all corrections applied
- "issues" lists each problem found (empty array if text is perfect)
- "score" is a writing quality score from 0-100
- Keep explanations short and in ${langName}
- Respond ONLY with valid JSON, no markdown, no backticks`;

  try {
    const raw = await callClaude(systemPrompt, text);
    const parsed = parseJSON(raw);
    if (!parsed) return res.status(500).json({ error: 'Failed to parse AI response' });

    db.prepare('INSERT INTO api_usage (user_id, endpoint, language, chars_checked) VALUES (?, ?, ?, ?)').run(req.user.id, 'check', language || 'en', text.length);
    db.prepare('UPDATE users SET api_calls_today = api_calls_today + 1 WHERE id = ?').run(req.user.id);

    res.json({ result: parsed });
  } catch (e) {
    console.error('[editor/check]', e.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/api/editor/rephrase', auth, async (req, res) => {
  const { text, language, style } = req.body;
  if (!text || text.trim().length < 2) return res.status(400).json({ error: 'Text required' });
  if (text.length > 10000) return res.status(400).json({ error: 'Text too long. Maximum 10,000 characters.' });
  if (!AI_API_KEY) return res.status(500).json({ error: 'AI service not configured' });

  const limit = checkRateLimit(req.user.id);
  if (!limit.allowed) return res.status(429).json({ error: limit.reason });

  const langName = LANG_NAMES[language] || language || 'English';
  const styleInstructions = {
    rephrase: `Rephrase the text in ${langName} to be clearer and more natural while keeping the same meaning.`,
    formal: `Rewrite the text in ${langName} using formal, professional language suitable for business correspondence.`,
    casual: `Rewrite the text in ${langName} using casual, friendly language suitable for informal communication.`,
    concise: `Make the text shorter and more concise in ${langName} while keeping the key meaning.`,
    elaborate: `Expand and elaborate on the text in ${langName} with more detail and nuance.`
  };

  const systemPrompt = `You are a professional ${langName} writing assistant. ${styleInstructions[style] || styleInstructions.rephrase}

Return a JSON response:
{
  "rephrased": "the rephrased text",
  "changes": "brief description of what changed, in ${langName}"
}

Respond ONLY with valid JSON, no markdown, no backticks.`;

  try {
    const raw = await callClaude(systemPrompt, text);
    const parsed = parseJSON(raw);
    if (!parsed) return res.status(500).json({ error: 'Failed to parse AI response' });

    db.prepare('INSERT INTO api_usage (user_id, endpoint, language, chars_checked) VALUES (?, ?, ?, ?)').run(req.user.id, 'rephrase', language || 'en', text.length);
    db.prepare('UPDATE users SET api_calls_today = api_calls_today + 1 WHERE id = ?').run(req.user.id);

    res.json({ result: parsed });
  } catch (e) {
    console.error('[editor/rephrase]', e.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Extension API (grammar check / rephrase) ───
function apiKeyAuth(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) return res.status(401).json({ error: 'API key required' });
  const user = db.prepare('SELECT id, plan, api_calls_today, api_calls_reset FROM users WHERE api_key = ?').get(apiKey);
  if (!user) return res.status(401).json({ error: 'Invalid API key' });
  const limit = checkRateLimit(user.id);
  if (!limit.allowed) return res.status(429).json({ error: limit.reason });
  req.apiUser = user;
  next();
}

const LANG_NAMES = {
  sv: 'Swedish', en: 'English', no: 'Norwegian', da: 'Danish', fi: 'Finnish',
  de: 'German', fr: 'French', es: 'Spanish', it: 'Italian', pt: 'Portuguese',
  nl: 'Dutch', pl: 'Polish', ar: 'Arabic', zh: 'Chinese', ja: 'Japanese',
  ko: 'Korean', ru: 'Russian', tr: 'Turkish', hi: 'Hindi', ur: 'Urdu',
  pa: 'Punjabi', phr: 'Pahari', prs: 'Dari'
};

async function callClaude(systemPrompt, userContent) {
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': AI_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: 'user', content: userContent }]
    })
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error: ${resp.status}`);
  }
  const data = await resp.json();
  return data.content[0].text;
}

function parseJSON(raw) {
  try { return JSON.parse(raw); } catch {}
  const m = raw.match(/\{[\s\S]*\}/);
  if (m) try { return JSON.parse(m[0]); } catch {}
  return null;
}

router.post('/api/check', apiKeyAuth, async (req, res) => {
  const { text, language } = req.body;
  if (!text || text.trim().length < 2) return res.status(400).json({ error: 'Text required' });
  if (text.length > 10000) return res.status(400).json({ error: 'Text too long. Maximum 10,000 characters.' });
  if (!AI_API_KEY) return res.status(500).json({ error: 'AI service not configured' });

  const langName = LANG_NAMES[language] || language || 'English';
  const systemPrompt = `You are a professional ${langName} grammar and spelling checker. Analyze the text and return a JSON response with this exact structure:
{
  "corrected": "the full corrected text",
  "issues": [
    {
      "type": "grammar|spelling|punctuation|style",
      "original": "the wrong part",
      "suggestion": "the corrected part",
      "explanation": "brief explanation in ${langName}"
    }
  ],
  "score": 85
}

Rules:
- "corrected" must contain the full text with all corrections applied
- "issues" lists each problem found (empty array if text is perfect)
- "score" is a writing quality score from 0-100
- Keep explanations short and in ${langName}
- Respond ONLY with valid JSON, no markdown, no backticks`;

  try {
    const raw = await callClaude(systemPrompt, text);
    const parsed = parseJSON(raw);
    if (!parsed) return res.status(500).json({ error: 'Failed to parse AI response' });

    db.prepare('INSERT INTO api_usage (user_id, endpoint, language, chars_checked) VALUES (?, ?, ?, ?)').run(req.apiUser.id, 'check', language || 'en', text.length);
    db.prepare('UPDATE users SET api_calls_today = api_calls_today + 1 WHERE id = ?').run(req.apiUser.id);

    res.json({ result: parsed });
  } catch (e) {
    console.error('[check]', e.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/api/rephrase', apiKeyAuth, async (req, res) => {
  const { text, language, style } = req.body;
  if (!text || text.trim().length < 2) return res.status(400).json({ error: 'Text required' });
  if (text.length > 10000) return res.status(400).json({ error: 'Text too long. Maximum 10,000 characters.' });
  if (!AI_API_KEY) return res.status(500).json({ error: 'AI service not configured' });

  const langName = LANG_NAMES[language] || language || 'English';
  const styleInstructions = {
    rephrase: `Rephrase the text in ${langName} to be clearer and more natural while keeping the same meaning.`,
    formal: `Rewrite the text in ${langName} using formal, professional language suitable for business correspondence.`,
    casual: `Rewrite the text in ${langName} using casual, friendly language suitable for informal communication.`,
    concise: `Make the text shorter and more concise in ${langName} while keeping the key meaning.`,
    elaborate: `Expand and elaborate on the text in ${langName} with more detail and nuance.`
  };

  const systemPrompt = `You are a professional ${langName} writing assistant. ${styleInstructions[style] || styleInstructions.rephrase}

Return a JSON response:
{
  "rephrased": "the rephrased text",
  "changes": "brief description of what changed, in ${langName}"
}

Respond ONLY with valid JSON, no markdown, no backticks.`;

  try {
    const raw = await callClaude(systemPrompt, text);
    const parsed = parseJSON(raw);
    if (!parsed) return res.status(500).json({ error: 'Failed to parse AI response' });

    db.prepare('INSERT INTO api_usage (user_id, endpoint, language, chars_checked) VALUES (?, ?, ?, ?)').run(req.apiUser.id, 'rephrase', language || 'en', text.length);
    db.prepare('UPDATE users SET api_calls_today = api_calls_today + 1 WHERE id = ?').run(req.apiUser.id);

    res.json({ result: parsed });
  } catch (e) {
    console.error('[rephrase]', e.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/api/translate', apiKeyAuth, async (req, res) => {
  const { text, language, targetLanguage } = req.body;
  if (!text || text.trim().length < 2) return res.status(400).json({ error: 'Text required' });
  if (text.length > 10000) return res.status(400).json({ error: 'Text too long. Maximum 10,000 characters.' });
  if (!targetLanguage) return res.status(400).json({ error: 'Target language required' });
  if (!AI_API_KEY) return res.status(500).json({ error: 'AI service not configured' });

  const sourceLang = LANG_NAMES[language] || language || 'auto-detect';
  const targetLang = LANG_NAMES[targetLanguage] || targetLanguage;

  const systemPrompt = `You are a professional translator. Translate the text from ${sourceLang} to ${targetLang}. Preserve the original tone and meaning.

Return a JSON response:
{
  "translated": "the translated text",
  "sourceLang": "${sourceLang}",
  "targetLang": "${targetLang}"
}

Respond ONLY with valid JSON, no markdown, no backticks.`;

  try {
    const raw = await callClaude(systemPrompt, text);
    const parsed = parseJSON(raw);
    if (!parsed) return res.status(500).json({ error: 'Failed to parse AI response' });

    db.prepare('INSERT INTO api_usage (user_id, endpoint, language, chars_checked) VALUES (?, ?, ?, ?)').run(req.apiUser.id, 'translate', targetLanguage, text.length);
    db.prepare('UPDATE users SET api_calls_today = api_calls_today + 1 WHERE id = ?').run(req.apiUser.id);

    res.json({ result: parsed });
  } catch (e) {
    console.error('[translate]', e.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Chatbot ───
router.post('/api/chatbot', chatbotLimiter, async (req, res) => {
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
