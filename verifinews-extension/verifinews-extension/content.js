// Extracts the main article text from the current page using a simple heuristic:
// prefer an <article> tag, otherwise fall back to concatenating <p> tags.
function extractArticleText() {
  const article = document.querySelector('article');
  if (article && article.innerText.trim().length > 200) {
    return article.innerText.trim();
  }

  const paragraphs = Array.from(document.querySelectorAll('p'))
    .map((p) => p.innerText.trim())
    .filter((t) => t.length > 40); // skip short nav/footer fragments

  if (paragraphs.length > 0) {
    return paragraphs.join('\n\n');
  }

  return document.body.innerText.trim();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'EXTRACT_ARTICLE') {
    sendResponse({ text: extractArticleText() });
  }
  if (message.type === 'SHOW_VERDICT_TOAST') {
    showVerdictToast(message.payload);
  }
  if (message.type === 'SHOW_ERROR_TOAST') {
    showVerdictToast({ error: message.message });
  }
  return true;
});

function showVerdictToast(payload) {
  const existing = document.getElementById('verifinews-toast-root');
  if (existing) existing.remove();

  const root = document.createElement('div');
  root.id = 'verifinews-toast-root';
  root.style.cssText = `
    position: fixed; top: 20px; right: 20px; z-index: 2147483647;
    font-family: Georgia, 'Merriweather', serif;
    background: #faf6ee; border: 2px solid #0b1437;
    border-radius: 10px; padding: 14px 16px; width: 260px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.25);
    color: #0b1437;
  `;

  if (payload.error) {
    root.innerHTML = `
      <div style="font-weight:900;font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#c2410c;margin-bottom:6px;">VerifiNews</div>
      <div style="font-size:12px;color:#ea0606;">${escapeHtml(payload.error)}</div>
    `;
  } else {
    const isFake = payload.result_label === 'fake';
    const color = isFake ? '#ea0606' : '#17ad37';
    root.innerHTML = `
      <div style="font-weight:900;font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#c2410c;margin-bottom:8px;">VerifiNews Verdict</div>
      <div style="display:flex;align-items:center;justify-content:space-between;border:2px solid ${color};color:${color};border-radius:8px;padding:8px 10px;font-weight:900;text-transform:uppercase;font-size:13px;">
        <span>${isFake ? 'Fake' : 'Verified'}</span>
        <span>${payload.confidence}%</span>
      </div>
    `;
  }

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.cssText = `
    position:absolute; top:6px; right:8px; border:none; background:none;
    font-size:16px; line-height:1; cursor:pointer; color:#707eae;
  `;
  closeBtn.onclick = () => root.remove();
  root.style.position = 'fixed';
  root.appendChild(closeBtn);

  document.body.appendChild(root);
  setTimeout(() => {
    if (document.getElementById('verifinews-toast-root')) root.remove();
  }, 8000);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
