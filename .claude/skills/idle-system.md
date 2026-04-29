# Skill: Idle System

Idle 감지 + Toast 노출 제한 공통 패턴입니다.
`idle.js`와 `toast.js`는 content script로 실행됩니다.

## Idle 감지 (`idle.js`)

```js
const IDLE_MS = 45_000;
let idleTimer = null;

function resetIdle() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(triggerToast, IDLE_MS);
}

['mousemove', 'keydown', 'scroll', 'click'].forEach(ev =>
  document.addEventListener(ev, resetIdle, { passive: true })
);

resetIdle();
```

## 노출 제한 (`chrome.storage.local`)

```js
const STORAGE_KEY = 'grammarblitz_last_shown';
const ONE_DAY_MS = 86_400_000;

async function canShow() {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  const last = result[STORAGE_KEY] || 0;
  return Date.now() - last > ONE_DAY_MS;
}

async function markShown() {
  await chrome.storage.local.set({ [STORAGE_KEY]: Date.now() });
}
```

> ⚠️ content script에서 `localStorage` 사용 금지 — 페이지별로 격리되어 전역 제한이 불가.
> 반드시 `chrome.storage.local` 사용.

## Toast UI (`toast.js`)

```js
async function triggerToast() {
  if (!(await canShow())) return;
  await markShown();

  const toast = document.createElement('div');
  toast.id = 'gb-toast';
  toast.innerHTML = `
    <span>⚡ Quick break?</span>
    <button id="gb-play">Play GrammarBlitz</button>
    <button id="gb-close">✕</button>
  `;
  document.body.appendChild(toast);

  document.getElementById('gb-play').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'openPopup' });
    toast.remove();
  });
  document.getElementById('gb-close').addEventListener('click', () => toast.remove());

  setTimeout(() => toast?.remove(), 5000);
}
```

## Toast 스타일 요구사항

- `position: fixed; bottom: 24px; right: 24px; z-index: 999999`
- extension CSS가 페이지 스타일에 영향 주지 않도록 Shadow DOM 또는 prefix 클래스 사용
- 자동 닫힘: 5초

## 주의사항

- `chrome.runtime.openOptionsPage()` 또는 `chrome.action.openPopup()`은 content script에서 직접 호출 불가
- 팝업 열기는 background service worker에 메시지 전달 방식으로 처리
