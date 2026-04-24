const BASE = (document.querySelector('base')?.getAttribute('href') || '').replace(/\/$/, '') || '/ord';
const API = BASE + '/api';

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('ord_token');
  if (token) {
    fetchMe();
  } else {
    route();
  }
  window.addEventListener('hashchange', route);
});

function esc(s) { const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }

function toast(msg, type = 'info') {
  const c = document.getElementById('toastContainer');
  const el = document.createElement('div');
  el.className = 'toast toast-' + type;
  el.textContent = msg;
  c.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

async function api(url, opts = {}) {
  const token = localStorage.getItem('ord_token');
  const headers = { ...(opts.headers || {}) };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  if (opts.body && typeof opts.body === 'object') {
    headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(opts.body);
  }
  const res = await fetch(API + url, { ...opts, headers });
  if (res.status === 401) { localStorage.removeItem('ord_token'); currentUser = null; route(); throw new Error('Unauthorized'); }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

async function fetchMe() {
  try {
    const data = await api('/auth/me');
    currentUser = data.user;
    route();
  } catch {
    localStorage.removeItem('ord_token');
    route();
  }
}

function route() {
  const hash = window.location.hash.replace('#', '') || '';
  if (hash.startsWith('dashboard') && currentUser) return renderDashboard();
  if (hash === 'tutorials') return renderTutorialsPage();
  renderLanding();
}

// ─── Landing Page ───
function renderLanding() {
  document.getElementById('app').innerHTML = `
    <nav class="nav">
      <div class="nav-inner">
        <a class="nav-brand" href="#" onclick="event.preventDefault();window.location.hash='';route()">
          <div class="nav-logo">O</div>
          Ord
        </a>
        <ul class="nav-links">
          <li><a href="#features" onclick="scrollToSection(event,'features-section')">Features</a></li>
          <li><a href="#languages" onclick="scrollToSection(event,'languages-section')">Languages</a></li>
          <li><a href="#tutorials" onclick="scrollToSection(event,'tutorials-section')">Tutorials</a></li>
          <li><a href="#pricing" onclick="scrollToSection(event,'pricing-section')">Pricing</a></li>
        </ul>
        <div class="nav-auth">
          ${currentUser ? `
            <button class="btn btn-ghost" onclick="window.location.hash='dashboard'">${esc(currentUser.name || currentUser.email)}</button>
            <button class="btn btn-secondary btn-sm" onclick="logout()">Log out</button>
          ` : `
            <button class="btn btn-ghost" onclick="showAuthModal('login')">Log in</button>
            <button class="btn btn-primary btn-sm" onclick="showAuthModal('register')">Get Started Free</button>
          `}
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <div>
          <div class="hero-badge">&#9889; AI-Powered Writing Assistant</div>
          <h1>Write perfectly in <span class="gradient-text">every language</span></h1>
          <p class="hero-desc">Ord uses advanced AI to check grammar, spelling, and style in 19+ languages. From Swedish to Urdu, Hindi to Japanese &mdash; write with confidence everywhere.</p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" onclick="showAuthModal('register')">Start Free &rarr;</button>
            <button class="btn btn-secondary btn-lg" onclick="scrollToSection(event,'features-section')">See Features</button>
          </div>
          <div class="hero-stats">
            <div class="hero-stat"><div class="hero-stat-value">19+</div><div class="hero-stat-label">Languages</div></div>
            <div class="hero-stat"><div class="hero-stat-value">AI</div><div class="hero-stat-label">Powered by Claude</div></div>
            <div class="hero-stat"><div class="hero-stat-value">$5</div><div class="hero-stat-label">/month Pro</div></div>
          </div>
        </div>
        <div class="hero-demo">
          <div class="demo-window">
            <div class="demo-titlebar">
              <div class="demo-dot demo-dot-red"></div>
              <div class="demo-dot demo-dot-yellow"></div>
              <div class="demo-dot demo-dot-green"></div>
            </div>
            <div class="demo-body">
              <div class="demo-text">
                Hej! Jag vill <span class="demo-error">berrata</span> om <span class="demo-error">mote</span> vi hade igar. Det var <span class="demo-error">valdigt</span> produktivt och vi <span class="demo-error">besultade</span> att...
              </div>
              <div class="demo-panel">
                <div class="demo-panel-header">
                  <div class="demo-panel-icon">O</div>
                  <div class="demo-panel-title">4 issues found</div>
                </div>
                <div class="demo-panel-issue"><del>berrata</del> &rarr; <strong>beratta</strong> &nbsp;Stavning</div>
                <div class="demo-panel-issue"><del>mote</del> &rarr; <strong>motet</strong> &nbsp;Grammatik</div>
                <div class="demo-panel-issue"><del>valdigt</del> &rarr; <strong>valdigt</strong> &nbsp;Stavning</div>
                <div class="demo-panel-issue"><del>besultade</del> &rarr; <strong>beslutade</strong> &nbsp;Stavning</div>
                <div class="demo-score">
                  <span style="font-size:12px;color:#94a3b8">Quality</span>
                  <div class="demo-score-bar"><div class="demo-score-fill"></div></div>
                  <div class="demo-score-value">78</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features" id="features-section">
      <div class="container">
        <div class="section-header">
          <div class="section-badge">&#10024; Features</div>
          <h2>Everything you need to write better</h2>
          <p>Powered by advanced AI that understands context, tone, and nuance in every language.</p>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon" style="background:#eff6ff;color:#3b82f6">&#128269;</div>
            <h3>Grammar Check</h3>
            <p>AI detects grammar errors that rule-based checkers miss. Understands context and meaning, not just patterns.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon" style="background:#fef3c7;color:#f59e0b">&#128221;</div>
            <h3>Spell Check</h3>
            <p>Smart spelling correction that knows the difference between similar words and understands compound words in Nordic languages.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon" style="background:#f0fdf4;color:#22c55e">&#127912;</div>
            <h3>Style & Tone</h3>
            <p>Adjust your writing to be formal, casual, concise, or elaborate. Perfect for business emails or friendly messages.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon" style="background:#faf5ff;color:#8b5cf6">&#128640;</div>
            <h3>Auto-Check</h3>
            <p>Works in real-time as you type in any text field on any website. Gmail, Google Docs, social media &mdash; everywhere.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon" style="background:#fef2f2;color:#ef4444">&#128274;</div>
            <h3>Privacy First</h3>
            <p>Your text is processed and forgotten. We never store your writing. Your words stay yours.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon" style="background:#ecfdf5;color:#059669">&#127760;</div>
            <h3>19+ Languages</h3>
            <p>From Swedish to Urdu, Hindi to Japanese. The most comprehensive multilingual AI writing assistant available.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Languages -->
    <section class="languages" id="languages-section">
      <div class="container">
        <div class="section-header">
          <div class="section-badge" style="background:rgba(59,130,246,0.15);color:#93c5fd">&#127760; Languages</div>
          <h2 style="color:#fff">Write in any language</h2>
          <p style="color:#94a3b8">Ord supports 19+ languages with deep understanding of grammar rules, idioms, and cultural nuances.</p>
        </div>
        <div class="lang-grid">
          ${[
            ['&#127480;&#127466;','Svenska','Nordic'],
            ['&#127468;&#127463;','English','Global'],
            ['&#127475;&#127476;','Norsk','Nordic'],
            ['&#127465;&#127472;','Dansk','Nordic'],
            ['&#127467;&#127470;','Suomi','Nordic'],
            ['&#127465;&#127466;','Deutsch','European'],
            ['&#127467;&#127479;','Francais','European'],
            ['&#127466;&#127480;','Espanol','European'],
            ['&#127470;&#127481;','Italiano','European'],
            ['&#127477;&#127481;','Portugues','European'],
            ['&#127475;&#127473;','Nederlands','European'],
            ['&#127477;&#127473;','Polski','European'],
            ['&#127477;&#127472;','Urdu','South Asian'],
            ['&#127470;&#127475;','Hindi','South Asian'],
            ['&#127470;&#127475;','Punjabi','South Asian'],
            ['&#127462;&#127467;','Dari','South Asian'],
            ['&#127462;&#127466;','Arabic','Middle East'],
            ['&#127464;&#127475;','Chinese','East Asian'],
            ['&#127471;&#127477;','Japanese','East Asian'],
            ['&#127472;&#127479;','Korean','East Asian'],
            ['&#127479;&#127482;','Russian','European'],
            ['&#127481;&#127479;','Turkish','European']
          ].map(([flag, name, region]) => `
            <div class="lang-card">
              <span class="lang-flag">${flag}</span>
              <div>
                <div class="lang-name">${name}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="how-it-works">
      <div class="container">
        <div class="section-header">
          <div class="section-badge">&#128736; How It Works</div>
          <h2>Up and running in 2 minutes</h2>
          <p>Install the Chrome extension and start writing better instantly.</p>
        </div>
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <h3>Install Extension</h3>
            <p>Add Ord to Chrome from the Web Store. One click install.</p>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <h3>Create Account</h3>
            <p>Sign up free and get your API key. 20 checks per day included.</p>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <h3>Start Writing</h3>
            <p>Type anywhere on the web. Ord checks your text automatically.</p>
          </div>
          <div class="step">
            <div class="step-number">4</div>
            <h3>Apply Fixes</h3>
            <p>Review suggestions and apply corrections with one click.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tutorials -->
    <section class="tutorials" id="tutorials-section">
      <div class="container">
        <div class="section-header">
          <div class="section-badge">&#128218; Tutorials</div>
          <h2>Learn how to use Ord</h2>
          <p>Step-by-step guides to get the most out of your AI writing assistant.</p>
        </div>
        <div class="tutorial-grid">
          <div class="tutorial-card" onclick="window.location.hash='tutorials'">
            <div class="tutorial-thumb" style="background:linear-gradient(135deg,#1e40af,#3b82f6)">&#128187;</div>
            <div class="tutorial-body">
              <div class="tutorial-tag">Getting Started</div>
              <h3>Install & Setup</h3>
              <p>How to install the Chrome extension, create your account, and configure your first language.</p>
            </div>
          </div>
          <div class="tutorial-card" onclick="window.location.hash='tutorials'">
            <div class="tutorial-thumb" style="background:linear-gradient(135deg,#7c3aed,#a78bfa)">&#128221;</div>
            <div class="tutorial-body">
              <div class="tutorial-tag">Features</div>
              <h3>Grammar & Style Check</h3>
              <p>Understanding grammar issues, style suggestions, and how to use the rephrase tools effectively.</p>
            </div>
          </div>
          <div class="tutorial-card" onclick="window.location.hash='tutorials'">
            <div class="tutorial-thumb" style="background:linear-gradient(135deg,#059669,#34d399)">&#127760;</div>
            <div class="tutorial-body">
              <div class="tutorial-tag">Advanced</div>
              <h3>Multi-Language Setup</h3>
              <p>Switch between languages, auto-detect text language, and configure preferences per website.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section class="pricing" id="pricing-section">
      <div class="container">
        <div class="section-header">
          <div class="section-badge">&#128176; Pricing</div>
          <h2>Simple, affordable pricing</h2>
          <p>Start free. Upgrade when you need more.</p>
        </div>
        <div class="pricing-grid">
          <div class="price-card">
            <h3>Free</h3>
            <div class="price-amount">$0</div>
            <div class="price-period">Forever free</div>
            <ul class="price-features">
              <li>20 checks per day</li>
              <li>All 19+ languages</li>
              <li>Grammar & spelling</li>
              <li>Chrome extension</li>
              <li>Basic style suggestions</li>
            </ul>
            <button class="btn btn-outline" onclick="showAuthModal('register')">Get Started</button>
          </div>
          <div class="price-card featured">
            <div class="price-badge">MOST POPULAR</div>
            <h3>Pro</h3>
            <div class="price-amount">$5 <span>/month</span></div>
            <div class="price-period">Cancel anytime</div>
            <ul class="price-features">
              <li>Unlimited checks</li>
              <li>All 19+ languages</li>
              <li>Grammar, spelling & style</li>
              <li>Rephrase & tone adjustment</li>
              <li>Priority AI processing</li>
              <li>API access</li>
              <li>Usage analytics</li>
            </ul>
            <button class="btn btn-primary" onclick="showAuthModal('register')">Start Pro &rarr;</button>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <div class="container">
        <h2>Ready to write better?</h2>
        <p>Join thousands of writers using Ord to communicate clearly in any language.</p>
        <div class="cta-actions">
          <button class="btn btn-primary btn-lg" onclick="showAuthModal('register')">Get Started Free &rarr;</button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="footer-brand"><div class="nav-logo" style="width:28px;height:28px;font-size:16px">O</div> Ord</div>
            <p class="footer-desc">AI-powered writing assistant for every language. Write with confidence in Swedish, English, Urdu, Hindi, and 15+ more languages.</p>
          </div>
          <div>
            <h4>Product</h4>
            <ul>
              <li><a href="#features" onclick="scrollToSection(event,'features-section')">Features</a></li>
              <li><a href="#pricing" onclick="scrollToSection(event,'pricing-section')">Pricing</a></li>
              <li><a href="#tutorials">Tutorials</a></li>
              <li><a href="#">Chrome Extension</a></li>
            </ul>
          </div>
          <div>
            <h4>Languages</h4>
            <ul>
              <li><a href="#">Swedish</a></li>
              <li><a href="#">English</a></li>
              <li><a href="#">Urdu</a></li>
              <li><a href="#">Hindi</a></li>
              <li><a href="#">All Languages</a></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          &copy; ${new Date().getFullYear()} Ord. All rights reserved.
        </div>
      </div>
    </footer>

    <!-- Auth Modal -->
    <div class="modal-overlay hidden" id="authModal">
      <div class="modal">
        <div class="modal-header">
          <h2 id="authModalTitle">Log In</h2>
          <button class="modal-close" onclick="closeAuthModal()">&times;</button>
        </div>
        <div class="modal-body" id="authModalBody"></div>
      </div>
    </div>
  `;
}

function scrollToSection(e, id) {
  e.preventDefault();
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ─── Auth ───
function showAuthModal(mode) {
  const modal = document.getElementById('authModal');
  const title = document.getElementById('authModalTitle');
  const body = document.getElementById('authModalBody');
  modal.classList.remove('hidden');

  if (mode === 'login') {
    title.textContent = 'Log In';
    body.innerHTML = `
      <div class="form-group">
        <label>Email</label>
        <input type="email" id="authEmail" placeholder="your@email.com">
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" id="authPassword" placeholder="Your password">
      </div>
      <button class="btn btn-primary" style="width:100%;justify-content:center;margin-top:8px" onclick="doLogin()">Log In</button>
      <p style="text-align:center;margin-top:16px;font-size:13px;color:var(--text-light)">
        Don't have an account? <a href="#" onclick="event.preventDefault();showAuthModal('register')">Sign up free</a>
      </p>
    `;
  } else {
    title.textContent = 'Create Account';
    body.innerHTML = `
      <div class="form-group">
        <label>Name</label>
        <input type="text" id="authName" placeholder="Your name">
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" id="authEmail" placeholder="your@email.com">
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" id="authPassword" placeholder="Choose a password (min 6 chars)">
      </div>
      <button class="btn btn-primary" style="width:100%;justify-content:center;margin-top:8px" onclick="doRegister()">Create Account</button>
      <p style="text-align:center;margin-top:16px;font-size:13px;color:var(--text-light)">
        Already have an account? <a href="#" onclick="event.preventDefault();showAuthModal('login')">Log in</a>
      </p>
    `;
  }
}

function closeAuthModal() {
  document.getElementById('authModal').classList.add('hidden');
}

async function doLogin() {
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;
  if (!email || !password) return toast('Fill in all fields', 'error');
  try {
    const data = await api('/auth/login', { method: 'POST', body: { email, password } });
    localStorage.setItem('ord_token', data.token);
    currentUser = data.user;
    closeAuthModal();
    window.location.hash = 'dashboard';
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function doRegister() {
  const name = document.getElementById('authName').value.trim();
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;
  if (!email || !password) return toast('Fill in email and password', 'error');
  if (password.length < 6) return toast('Password must be at least 6 characters', 'error');
  try {
    const data = await api('/auth/register', { method: 'POST', body: { name, email, password } });
    localStorage.setItem('ord_token', data.token);
    currentUser = data.user;
    closeAuthModal();
    toast('Welcome to Ord!', 'success');
    window.location.hash = 'dashboard';
  } catch (e) {
    toast(e.message, 'error');
  }
}

function logout() {
  localStorage.removeItem('ord_token');
  currentUser = null;
  window.location.hash = '';
  route();
}

// ─── Dashboard ───
let dashTab = 'overview';

function renderDashboard() {
  document.getElementById('app').innerHTML = `
    <nav class="nav">
      <div class="nav-inner">
        <a class="nav-brand" href="#" onclick="event.preventDefault();window.location.hash='';route()">
          <div class="nav-logo">O</div>
          Ord
        </a>
        <div class="nav-auth">
          <span style="color:#94a3b8;font-size:13px">${esc(currentUser.email)}</span>
          <span style="display:inline-block;padding:3px 10px;background:${currentUser.plan === 'pro' ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)' : '#334155'};color:#fff;border-radius:12px;font-size:11px;font-weight:600">${currentUser.plan === 'pro' ? 'PRO' : 'FREE'}</span>
          <button class="btn btn-ghost btn-sm" onclick="logout()">Log out</button>
        </div>
      </div>
    </nav>
    <div class="dashboard">
      <div class="dash-grid">
        <div class="dash-sidebar">
          <button class="dash-nav-item ${dashTab === 'overview' ? 'active' : ''}" onclick="dashTab='overview';renderDashContent()">&#128200; Overview</button>
          <button class="dash-nav-item ${dashTab === 'apikey' ? 'active' : ''}" onclick="dashTab='apikey';renderDashContent()">&#128273; API Key</button>
          <button class="dash-nav-item ${dashTab === 'usage' ? 'active' : ''}" onclick="dashTab='usage';renderDashContent()">&#128202; Usage</button>
          <button class="dash-nav-item ${dashTab === 'profile' ? 'active' : ''}" onclick="dashTab='profile';renderDashContent()">&#128100; Profile</button>
          <button class="dash-nav-item ${dashTab === 'subscription' ? 'active' : ''}" onclick="dashTab='subscription';renderDashContent()">&#11088; Subscription</button>
        </div>
        <div class="dash-content" id="dashContent"></div>
      </div>
    </div>
  `;
  renderDashContent();
}

async function renderDashContent() {
  const cont = document.getElementById('dashContent');
  document.querySelectorAll('.dash-nav-item').forEach((el, i) => {
    const tabs = ['overview', 'apikey', 'usage', 'profile', 'subscription'];
    el.classList.toggle('active', tabs[i] === dashTab);
  });

  if (dashTab === 'overview') {
    let usage = { totals: { total_checks: 0, total_chars: 0 }, langStats: [] };
    try { usage = await api('/usage?days=30'); } catch {}
    const remaining = currentUser.plan === 'pro' ? 'Unlimited' : (currentUser.remaining_calls ?? '20');

    cont.innerHTML = `
      <div class="dash-header"><h2>Welcome, ${esc(currentUser.name || 'Writer')}!</h2></div>
      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-label">Total Checks</div>
          <div class="stat-value">${usage.totals.total_checks || 0}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Characters Checked</div>
          <div class="stat-value">${((usage.totals.total_chars || 0) / 1000).toFixed(1)}k</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Remaining Today</div>
          <div class="stat-value">${remaining}</div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Quick Start</h3></div>
        <div class="card-body">
          <p style="margin-bottom:16px;color:var(--text-light)">Get started with Ord in 3 easy steps:</p>
          <ol style="padding-left:20px;line-height:2;font-size:14px">
            <li>Install the <strong>Ord Chrome Extension</strong> from the download page</li>
            <li>Open the extension popup and paste your <strong>API Key</strong></li>
            <li>Start typing in any text field &mdash; Ord will check automatically!</li>
          </ol>
          <div style="margin-top:20px">
            <button class="btn btn-primary btn-sm" onclick="dashTab='apikey';renderDashContent()">Get Your API Key &rarr;</button>
          </div>
        </div>
      </div>
      ${usage.langStats && usage.langStats.length > 0 ? `
        <div class="card">
          <div class="card-header"><h3>Top Languages</h3></div>
          <div class="card-body">
            ${usage.langStats.slice(0, 5).map(l => `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
                <span style="font-size:14px;font-weight:500">${esc(l.language || 'Unknown')}</span>
                <span style="font-size:13px;color:var(--text-light)">${l.count} checks</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;
  } else if (dashTab === 'apikey') {
    cont.innerHTML = `
      <div class="dash-header"><h2>API Key</h2></div>
      <div class="card">
        <div class="card-body">
          <p style="margin-bottom:16px;color:var(--text-light)">Use this API key in the Ord Chrome Extension or to access the API directly.</p>
          <div class="api-key-box" id="apiKeyDisplay">${esc(currentUser.api_key || 'Loading...')}</div>
          <div style="display:flex;gap:12px;margin-top:16px">
            <button class="btn btn-sm btn-primary" onclick="copyApiKey()">Copy Key</button>
            <button class="btn btn-sm btn-outline" onclick="regenerateKey()">Regenerate Key</button>
          </div>
          <div style="margin-top:24px;padding:16px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px">
            <p style="font-size:13px;color:#92400e;font-weight:600;margin-bottom:4px">&#9888; Keep your API key secret</p>
            <p style="font-size:13px;color:#a16207">Don't share this key publicly. If compromised, regenerate it immediately.</p>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Extension Setup</h3></div>
        <div class="card-body">
          <ol style="padding-left:20px;line-height:2.2;font-size:14px">
            <li>Install the Ord Chrome Extension</li>
            <li>Click the Ord icon in your browser toolbar</li>
            <li>Paste your API key in the settings</li>
            <li>Select your preferred language</li>
            <li>Start typing anywhere &mdash; Ord will check automatically!</li>
          </ol>
        </div>
      </div>
    `;
  } else if (dashTab === 'usage') {
    let usage = { stats: [], totals: {}, langStats: [] };
    try { usage = await api('/usage?days=30'); } catch {}

    cont.innerHTML = `
      <div class="dash-header"><h2>Usage Statistics</h2></div>
      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-label">Total Checks</div>
          <div class="stat-value">${usage.totals.total_checks || 0}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Characters Checked</div>
          <div class="stat-value">${((usage.totals.total_chars || 0) / 1000).toFixed(1)}k</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Languages Used</div>
          <div class="stat-value">${(usage.langStats || []).length}</div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Last 30 Days</h3></div>
        <div class="card-body">
          ${(usage.stats || []).length === 0 ? '<p style="color:var(--text-light);font-size:14px">No usage data yet. Start using Ord to see your statistics!</p>' : `
            <div style="max-height:300px;overflow-y:auto">
              ${usage.stats.map(s => `
                <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
                  <span style="font-size:14px">${esc(s.day)}</span>
                  <span style="font-size:13px;color:var(--text-light)">${s.language || '-'}</span>
                  <span style="font-size:13px;font-weight:600">${s.checks} checks</span>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    `;
  } else if (dashTab === 'profile') {
    cont.innerHTML = `
      <div class="dash-header"><h2>Profile</h2></div>
      <div class="card">
        <div class="card-body">
          <div class="form-group">
            <label>Name</label>
            <input type="text" id="profileName" value="${esc(currentUser.name || '')}">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" value="${esc(currentUser.email)}" disabled style="background:#f8fafc">
          </div>
          <div class="form-group">
            <label>New Password (leave blank to keep current)</label>
            <input type="password" id="profilePassword" placeholder="New password">
          </div>
          <button class="btn btn-primary" onclick="updateProfile()">Save Changes</button>
        </div>
      </div>
    `;
  } else if (dashTab === 'subscription') {
    cont.innerHTML = `
      <div class="dash-header"><h2>Subscription</h2></div>
      <div class="card">
        <div class="card-body">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
            <span style="display:inline-block;padding:6px 16px;background:${currentUser.plan === 'pro' ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)' : '#e2e8f0'};color:${currentUser.plan === 'pro' ? '#fff' : '#475569'};border-radius:20px;font-size:14px;font-weight:700">${currentUser.plan === 'pro' ? 'PRO' : 'FREE'}</span>
            <span style="font-size:14px;color:var(--text-light)">${currentUser.plan === 'pro' ? '$5/month - Unlimited checks' : '20 checks per day'}</span>
          </div>
          ${currentUser.plan === 'pro' ? `
            <p style="font-size:14px;color:var(--text-light);margin-bottom:16px">You have unlimited grammar checks and full access to all features.</p>
            <button class="btn btn-danger btn-sm" onclick="cancelSubscription()">Cancel Subscription</button>
          ` : `
            <p style="font-size:14px;color:var(--text-light);margin-bottom:20px">Upgrade to Pro for unlimited checks, rephrase tools, and priority processing.</p>
            <div class="price-card featured" style="max-width:400px;border:2px solid var(--primary)">
              <h3>Pro Plan</h3>
              <div class="price-amount">$5 <span>/month</span></div>
              <ul class="price-features">
                <li>Unlimited checks</li>
                <li>Rephrase & tone adjustment</li>
                <li>Priority AI processing</li>
                <li>Usage analytics</li>
              </ul>
              <button class="btn btn-primary" onclick="upgradeToPro()">Upgrade to Pro &rarr;</button>
            </div>
          `}
        </div>
      </div>
    `;
  }
}

function copyApiKey() {
  navigator.clipboard.writeText(currentUser.api_key || '').then(() => toast('API key copied!', 'success'));
}

async function regenerateKey() {
  if (!confirm('Regenerate API key? Your current key will stop working.')) return;
  try {
    const data = await api('/regenerate-key', { method: 'POST' });
    currentUser.api_key = data.api_key;
    document.getElementById('apiKeyDisplay').textContent = data.api_key;
    toast('New API key generated!', 'success');
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function updateProfile() {
  const name = document.getElementById('profileName').value.trim();
  const password = document.getElementById('profilePassword').value;
  try {
    const body = { name };
    if (password) body.password = password;
    const data = await api('/profile', { method: 'PUT', body });
    currentUser = { ...currentUser, ...data.user };
    toast('Profile updated!', 'success');
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function upgradeToPro() {
  try {
    const data = await api('/create-checkout', { method: 'POST' });
    if (data.url) window.location.href = data.url;
    else toast('Stripe is not configured yet', 'error');
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function cancelSubscription() {
  if (!confirm('Cancel your Pro subscription? You will lose unlimited checks.')) return;
  try {
    await api('/cancel-subscription', { method: 'POST' });
    currentUser.plan = 'free';
    toast('Subscription cancelled', 'info');
    renderDashContent();
  } catch (e) {
    toast(e.message, 'error');
  }
}

// ─── Tutorials Page ───
function renderTutorialsPage() {
  document.getElementById('app').innerHTML = `
    <nav class="nav">
      <div class="nav-inner">
        <a class="nav-brand" href="#" onclick="event.preventDefault();window.location.hash='';route()">
          <div class="nav-logo">O</div>
          Ord
        </a>
        <div class="nav-auth">
          ${currentUser ? `
            <button class="btn btn-ghost" onclick="window.location.hash='dashboard'">${esc(currentUser.name || currentUser.email)}</button>
          ` : `
            <button class="btn btn-ghost" onclick="showAuthModal('login')">Log in</button>
            <button class="btn btn-primary btn-sm" onclick="showAuthModal('register')">Get Started Free</button>
          `}
        </div>
      </div>
    </nav>
    <div style="padding-top:100px;max-width:800px;margin:0 auto;padding-left:24px;padding-right:24px;padding-bottom:80px">
      <h1 style="font-size:36px;font-weight:800;margin-bottom:8px">Tutorials</h1>
      <p style="font-size:16px;color:var(--text-light);margin-bottom:48px">Everything you need to know about using Ord.</p>

      <div style="margin-bottom:48px">
        <h2 style="font-size:24px;font-weight:700;margin-bottom:16px">1. Getting Started</h2>
        <div class="card">
          <div class="card-body" style="line-height:1.8;font-size:15px;color:#334155">
            <h3 style="font-size:18px;margin-bottom:12px">Installing the Chrome Extension</h3>
            <ol style="padding-left:24px;margin-bottom:20px">
              <li>Download the extension from GitHub or Chrome Web Store</li>
              <li>Open Chrome and navigate to <code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:13px">chrome://extensions</code></li>
              <li>Enable "Developer mode" using the toggle in the top right</li>
              <li>Click "Load unpacked" and select the Ord extension folder</li>
              <li>The Ord icon (blue "O") will appear in your toolbar</li>
            </ol>
            <h3 style="font-size:18px;margin-bottom:12px">Setting Up Your Account</h3>
            <ol style="padding-left:24px;margin-bottom:20px">
              <li>Visit <a href="#">ord.skylarkmedia.se</a> and click "Get Started Free"</li>
              <li>Create an account with your email</li>
              <li>Go to Dashboard &gt; API Key</li>
              <li>Copy your API key</li>
              <li>Click the Ord extension icon, paste the key, and save</li>
            </ol>
          </div>
        </div>
      </div>

      <div style="margin-bottom:48px">
        <h2 style="font-size:24px;font-weight:700;margin-bottom:16px">2. Using Grammar Check</h2>
        <div class="card">
          <div class="card-body" style="line-height:1.8;font-size:15px;color:#334155">
            <h3 style="font-size:18px;margin-bottom:12px">Automatic Checking</h3>
            <p style="margin-bottom:16px">When enabled, Ord automatically checks your text as you type in any text field on any website. A small red badge will appear if issues are found.</p>
            <h3 style="font-size:18px;margin-bottom:12px">Manual Checking</h3>
            <p style="margin-bottom:16px">Press <kbd style="background:#e2e8f0;padding:2px 8px;border-radius:4px;font-size:12px;border:1px solid #cbd5e1">Ctrl</kbd> + <kbd style="background:#e2e8f0;padding:2px 8px;border-radius:4px;font-size:12px;border:1px solid #cbd5e1">Shift</kbd> + <kbd style="background:#e2e8f0;padding:2px 8px;border-radius:4px;font-size:12px;border:1px solid #cbd5e1">G</kbd> to open the Ord panel and check the current text field.</p>
            <h3 style="font-size:18px;margin-bottom:12px">Understanding Results</h3>
            <p style="margin-bottom:8px">Each issue is color-coded:</p>
            <ul style="padding-left:24px;margin-bottom:16px">
              <li><span style="color:#ef4444;font-weight:600">G</span> - Grammar issues (sentence structure, word order)</li>
              <li><span style="color:#f59e0b;font-weight:600">S</span> - Spelling mistakes</li>
              <li><span style="color:#8b5cf6;font-weight:600">P</span> - Punctuation (commas, periods, semicolons)</li>
              <li><span style="color:#3b82f6;font-weight:600">T</span> - Style suggestions (clarity, conciseness)</li>
            </ul>
            <p>Click "Tillampa" (Apply) to fix all issues at once, or review each one individually.</p>
          </div>
        </div>
      </div>

      <div style="margin-bottom:48px">
        <h2 style="font-size:24px;font-weight:700;margin-bottom:16px">3. Rephrase & Tone</h2>
        <div class="card">
          <div class="card-body" style="line-height:1.8;font-size:15px;color:#334155">
            <p style="margin-bottom:16px">Ord can rephrase your text in different styles:</p>
            <ul style="padding-left:24px;margin-bottom:16px">
              <li><strong>Rephrase</strong> - Rewrite for clarity while keeping the same meaning</li>
              <li><strong>Formal</strong> - Professional tone for business emails and documents</li>
              <li><strong>Casual</strong> - Friendly tone for social media and informal messages</li>
            </ul>
            <p style="margin-bottom:12px">To use: Select text, right-click, and choose from the Ord menu. Or use the buttons in the Ord panel.</p>
          </div>
        </div>
      </div>

      <div style="margin-bottom:48px">
        <h2 style="font-size:24px;font-weight:700;margin-bottom:16px">4. Multi-Language Support</h2>
        <div class="card">
          <div class="card-body" style="line-height:1.8;font-size:15px;color:#334155">
            <p style="margin-bottom:16px">Ord supports 19+ languages. To switch language:</p>
            <ol style="padding-left:24px;margin-bottom:16px">
              <li>Click the Ord extension icon in your toolbar</li>
              <li>Select your language from the grid</li>
              <li>Click "Save"</li>
            </ol>
            <p style="margin-bottom:12px"><strong>Nordic Languages:</strong> Swedish, Norwegian, Danish, Finnish</p>
            <p style="margin-bottom:12px"><strong>South Asian:</strong> Hindi, Urdu, Punjabi, Dari</p>
            <p style="margin-bottom:12px"><strong>European:</strong> English, German, French, Spanish, Italian, Portuguese, Dutch, Polish, Russian, Turkish</p>
            <p><strong>East Asian:</strong> Chinese, Japanese, Korean</p>
          </div>
        </div>
      </div>

      <div style="text-align:center;padding:40px 0">
        <h2 style="font-size:24px;font-weight:700;margin-bottom:12px">Need more help?</h2>
        <p style="color:var(--text-light);margin-bottom:20px">Contact us and we'll help you get started.</p>
        <button class="btn btn-primary" onclick="window.location.hash=''">Back to Home</button>
      </div>
    </div>

    <!-- Auth Modal -->
    <div class="modal-overlay hidden" id="authModal">
      <div class="modal">
        <div class="modal-header">
          <h2 id="authModalTitle">Log In</h2>
          <button class="modal-close" onclick="closeAuthModal()">&times;</button>
        </div>
        <div class="modal-body" id="authModalBody"></div>
      </div>
    </div>
  `;
}
