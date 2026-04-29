# Skill: Game State Machine

GrammarBlitz가 사용하는 상태 머신 패턴입니다.

## 상태 정의

```js
const GAME_STATE = Object.freeze({
  INIT:    'INIT',
  RUNNING: 'RUNNING',
  FAIL:    'FAIL',
  RESULT:  'RESULT',
});
```

- `INIT`: constructor에서 첫 진입. 인트로 화면(규칙 테이블 + 조작법)을 캔버스에 그림.
  Space/클릭 → `RUNNING`. **재시작 시에는 INIT을 거치지 않고 곧바로 RUNNING.**

## 핵심 패턴

```js
setState(newState) {
  this.state = newState;
  if (newState === GAME_STATE.INIT)    this._drawIntro();
  if (newState === GAME_STATE.RUNNING) this._startLoop();
  if (newState === GAME_STATE.FAIL)    this._onFail();
  if (newState === GAME_STATE.RESULT)  this._showResult();
}

_startLoop() {
  let last = performance.now();
  const loop = (now) => {
    if (this.state !== GAME_STATE.RUNNING) return;
    const dt = Math.min((now - last) / 1000, 0.05); // 50ms cap
    last = now;
    this.update(dt);
    this.draw(this.ctx);
    this.animFrameId = requestAnimationFrame(loop);
  };
  this.animFrameId = requestAnimationFrame(loop);
}

_onFail() {
  cancelAnimationFrame(this.animFrameId);
  this.draw(this.ctx); // freeze frame
  setTimeout(() => this.setState(GAME_STATE.RESULT), 300);
}
```

## FAIL 컨텍스트 전달

FAIL 발생 시 원인 문장과 이유를 반드시 저장해 Result Screen에 전달한다.

```js
// 정답 격추로 FAIL
this.failSentence = sentence.item; // { sentence, explanation, ... }
this.failReason = 'shot-correct';
this.setState(GAME_STATE.FAIL);

// 오답 통과로 FAIL (또는 감점)
this.failSentence = sentence.item;
this.failReason = 'missed-wrong';
```

## 주의사항

- `dt`는 항상 50ms cap — 탭 비활성화 복귀 시 튐 방지
- `cancelAnimationFrame` 없이 상태 전환 금지 (메모리 누수)
- `FAIL` → `RESULT` 전환은 항상 300ms 딜레이
- 상태 바깥에서 게임 변수 직접 변경 금지 — 반드시 `setState()` 경유
