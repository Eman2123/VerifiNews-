importScripts('config.js');

const MAX_CHARS = 5000;

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'verifinews-check-selection',
    title: 'Check with VerifiNews',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== 'verifinews-check-selection' || !tab?.id) return;

  const selectedText = (info.selectionText || '').trim();
  if (!selectedText) return;

  const { token } = await chrome.storage.local.get('token');
  if (!token) {
    chrome.tabs.sendMessage(tab.id, {
      type: 'SHOW_ERROR_TOAST',
      message: 'Please sign in from the VerifiNews extension icon first.',
    });
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/detect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ input: selectedText.slice(0, MAX_CHARS), type: 'text' }),
    });

    if (res.status === 401) {
      await chrome.storage.local.remove(['token', 'email', 'role']);
      chrome.tabs.sendMessage(tab.id, {
        type: 'SHOW_ERROR_TOAST',
        message: 'Session expired. Please sign in again from the extension icon.',
      });
      return;
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Analysis failed.');

    chrome.tabs.sendMessage(tab.id, { type: 'SHOW_VERDICT_TOAST', payload: data });
  } catch (err) {
    chrome.tabs.sendMessage(tab.id, {
      type: 'SHOW_ERROR_TOAST',
      message: err.message || 'Could not reach VerifiNews backend.',
    });
  }
});
