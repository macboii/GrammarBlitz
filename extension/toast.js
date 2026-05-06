const STORAGE_KEY = 'grammarsmash_shown_times';
const ONE_DAY_MS = 86_400_000;
const MAX_DAILY = 5;

async function canShow() {
  try {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    const times = (result[STORAGE_KEY] || []).filter(t => Date.now() - t < ONE_DAY_MS);
    return times.length < MAX_DAILY;
  } catch (_) { return false; }
}

async function markShown() {
  try {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    const times = (result[STORAGE_KEY] || []).filter(t => Date.now() - t < ONE_DAY_MS);
    times.push(Date.now());
    await chrome.storage.local.set({ [STORAGE_KEY]: times });
  } catch (_) { /* context invalidated — skip */ }
}

function createToastEl() {
  const el = document.createElement('div');
  el.id = 'gb-toast';
  el.attachShadow({ mode: 'open' }).innerHTML = `
    <style>
      :host {
        position: fixed;
        top: 24px;
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
        from { transform: translateY(-20px); opacity: 0; }
        to   { transform: translateY(0);     opacity: 1; }
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
      <button class="play">Play GrammarSmash</button>
      <button class="close">✕</button>
    </div>`;
  return el;
}

async function triggerToast() {
  // Guard: if extension context already invalidated, bail out silently
  if (!chrome.runtime?.id) return;
  if (!(await canShow())) return;
  await markShown();

  const toast = createToastEl();
  document.body.appendChild(toast);

  const shadow = toast.shadowRoot;
  let autoClose = setTimeout(() => toast.remove(), 5000);

  const wrap = shadow.querySelector('.wrap');
  wrap.addEventListener('mouseenter', () => clearTimeout(autoClose));
  wrap.addEventListener('mouseleave', () => {
    autoClose = setTimeout(() => toast.remove(), 2000);
  });

  shadow.querySelector('.play').addEventListener('click', () => {
    clearTimeout(autoClose);
    try { chrome.runtime.sendMessage({ action: 'openGame' }); } catch (_) { /* context invalidated */ }
    toast.remove();
  });

  shadow.querySelector('.close').addEventListener('click', () => {
    clearTimeout(autoClose);
    toast.remove();
  });
}
