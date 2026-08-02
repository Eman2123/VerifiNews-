const MAX_CHARS = 5000;

const loginView = document.getElementById('loginView');
const mainView = document.getElementById('mainView');
const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');
const userEmailEl = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logoutBtn');
const analyzeBtn = document.getElementById('analyzeBtn');
const analyzeLabel = document.getElementById('analyzeLabel');
const pasteToggle = document.getElementById('pasteToggle');
const pasteBox = document.getElementById('pasteBox');
const pasteText = document.getElementById('pasteText');
const pasteAnalyzeBtn = document.getElementById('pasteAnalyzeBtn');
const resultBox = document.getElementById('resultBox');
const verdictBadge = document.getElementById('verdictBadge');
const verdictLabel = document.getElementById('verdictLabel');
const verdictConfidence = document.getElementById('verdictConfidence');
const resultError = document.getElementById('resultError');

init();

async function init() {
  const { token, email } = await chrome.storage.local.get(['token', 'email']);
  if (token) {
    showMain(email);
  } else {
    showLogin();
  }
}

function showLogin() {
  loginView.classList.remove('hidden');
  mainView.classList.add('hidden');
}

function showMain(email) {
  loginView.classList.add('hidden');
  mainView.classList.remove('hidden');
  userEmailEl.textContent = email || '';
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.classList.add('hidden');
  loginBtn.disabled = true;
  loginBtn.textContent = 'Signing in...';

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Login failed.');

    await chrome.storage.local.set({
      token: data.access_token,
      email: data.user?.email || email,
      role: data.user?.role || 'user',
    });
    showMain(data.user?.email || email);
  } catch (err) {
    loginError.textContent = err.message || 'Login failed. Check your credentials.';
    loginError.classList.remove('hidden');
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Sign In';
  }
});

logoutBtn.addEventListener('click', async () => {
  await chrome.storage.local.remove(['token', 'email', 'role']);
  resultBox.classList.add('hidden');
  showLogin();
});

pasteToggle.addEventListener('click', () => {
  pasteBox.classList.toggle('hidden');
});

analyzeBtn.addEventListener('click', async () => {
  resultBox.classList.add('hidden');
  resultError.classList.add('hidden');
  setAnalyzing(true);

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, { type: 'EXTRACT_ARTICLE' });
    const text = (response?.text || '').trim();

    if (!text) {
      throw new Error('Could not find article text on this page. Try "Paste text instead".');
    }
    await runDetect(text.slice(0, MAX_CHARS));
  } catch (err) {
    showResultError(err.message || 'Could not read this page.');
  } finally {
    setAnalyzing(false);
  }
});

pasteAnalyzeBtn.addEventListener('click', async () => {
  const text = pasteText.value.trim();
  if (!text) return;
  resultBox.classList.add('hidden');
  resultError.classList.add('hidden');
  pasteAnalyzeBtn.disabled = true;
  pasteAnalyzeBtn.textContent = 'Analyzing...';
  try {
    await runDetect(text.slice(0, MAX_CHARS));
  } catch (err) {
    showResultError(err.message || 'Something went wrong.');
  } finally {
    pasteAnalyzeBtn.disabled = false;
    pasteAnalyzeBtn.textContent = 'Analyze Text';
  }
});

async function runDetect(inputText) {
  const { token } = await chrome.storage.local.get('token');
  if (!token) {
    showLogin();
    return;
  }

  const res = await fetch(`${API_BASE}/detect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ input: inputText, type: 'text' }),
  });

  if (res.status === 401) {
    await chrome.storage.local.remove(['token', 'email', 'role']);
    showLogin();
    throw new Error('Session expired. Please sign in again.');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Analysis failed.');

  showResult(data.result_label, data.confidence);
}

function showResult(resultLabel, confidence) {
  resultBox.classList.remove('hidden');
  resultError.classList.add('hidden');
  verdictBadge.classList.remove('real', 'fake');
  verdictBadge.classList.add(resultLabel === 'fake' ? 'fake' : 'real');
  verdictLabel.textContent = resultLabel === 'fake' ? 'Fake' : 'Verified';
  verdictConfidence.textContent = `${confidence}%`;
}

function showResultError(message) {
  resultBox.classList.remove('hidden');
  resultError.textContent = message;
  resultError.classList.remove('hidden');
}

function setAnalyzing(isAnalyzing) {
  analyzeBtn.disabled = isAnalyzing;
  analyzeLabel.textContent = isAnalyzing ? 'Analyzing...' : 'Check This Page';
}
