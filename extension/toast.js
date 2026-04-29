const STORAGE_KEY = 'grammarblitz_last_shown';
const ONE_DAY_MS = 86_400_000;

async function canShow() {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return Date.now() - (result[STORAGE_KEY] || 0) > ONE_DAY_MS;
}

async function markShown() {
  await chrome.storage.local.set({ [STORAGE_KEY]: Date.now() });
}

function createToastEl() {
  const el = document.createElement('div');
  el.id = 'gb-toast';
  el.attachShadow({ mode: 'open' }).innerHTML = `
    <style>
      :host {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 2147483647;
        font-family: 'Courier New', monospace;
      }
      .wrap {
        background: #1a1a2e;
        border: 1px solid #facc15;
        border-radius: 10px;
        padding: 14px 18px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 4px 24px rgba(0,0,0,0.5);
        animation: slide-in 0.3s ease;
      }
      @keyframes slide-in {
        from { transform: translateY(20px); opacity: 0; }
        to   { transform: translateY(0);    opacity: 1; }
      }
      .msg { color: #e5e7eb; font-size: 13px; white-space: nowrap; }
      .play {
        background: #facc15;
        color: #0f0f1a;
        border: none;
        border-radius: 6px;
        padding: 7px 14px;
        font-size: 12px;
        font-weight: bold;
        font-family: inherit;
        cursor: pointer;
        white-space: nowrap;
      }
      .close {
        background: none;
        border: none;
        color: #6b7280;
        cursor: pointer;
        font-size: 16px;
        line-height: 1;
        padding: 0 2px;
      }
      .close:hover { color: #e5e7eb; }
    </style>
    <div class="wrap">
      <span class="msg">⚡ Quick grammar break?</span>
      <button class="play">Play GrammarBlitz</button>
      <button class="close">✕</button>
    </div>`;
  return el;
}

async function triggerToast() {
  if (!(await canShow())) return;
  await markShown();

  const toast = createToastEl();
  document.body.appendChild(toast);

  const shadow = toast.shadowRoot;
  const autoClose = setTimeout(() => toast.remove(), 5000);

  shadow.querySelector('.play').addEventListener('click', () => {
    clearTimeout(autoClose);
    chrome.runtime.sendMessage({ action: 'openGame' });
    toast.remove();
  });

  shadow.querySelector('.close').addEventListener('click', () => {
    clearTimeout(autoClose);
    toast.remove();
  });
}
