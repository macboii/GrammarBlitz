const IDLE_MS = 20_000;
let idleTimer = null;

function resetIdle() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => triggerToast(), IDLE_MS);
}

['mousemove', 'keydown', 'scroll', 'click'].forEach(ev =>
  document.addEventListener(ev, resetIdle, { passive: true })
);

resetIdle();
