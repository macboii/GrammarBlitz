인자로 받은 게임 이름($ARGUMENTS)으로 새 미니게임을 추가하라.

$ARGUMENTS가 비어 있으면 "게임 이름을 입력하세요. 예: /add-game grammarRunner" 라고 출력하고 중단한다.

## 1단계: 디렉토리 생성

아래 디렉토리가 없으면 생성한다 (Bash mkdir -p 사용):

- `extension/games/`
- `extension/data/`
- `extension/assets/`

## 2단계: 게임 파일 생성

`extension/games/$ARGUMENTS.js`를 생성한다. 클래스 이름은 $ARGUMENTS를 PascalCase로 변환한다 (예: grammarRunner → GrammarRunner).

아래 boilerplate를 기반으로 작성한다:

```js
const GAME_STATE = Object.freeze({ INIT:'INIT', RUNNING:'RUNNING', FAIL:'FAIL', RESULT:'RESULT' });
const BASE_SPEED = 5;
const MAX_SPEED = 15;
const GRAVITY = 0.6;
const JUMP_FORCE = -14;

class GrammarRunner {
  constructor(canvas, data) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.data = data;
    this.state = GAME_STATE.INIT;
    this.score = 0;
    this.animFrameId = null;
  }

  setState(newState) {
    this.state = newState;
    if (newState === GAME_STATE.RUNNING) this.startLoop();
    if (newState === GAME_STATE.FAIL) {
      cancelAnimationFrame(this.animFrameId);
      setTimeout(() => this.setState(GAME_STATE.RESULT), 300);
    }
    if (newState === GAME_STATE.RESULT) this.showResult();
  }

  startLoop() {
    let last = performance.now();
    const loop = (now) => {
      if (this.state !== GAME_STATE.RUNNING) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      this.update(dt);
      this.draw(this.ctx);
      this.animFrameId = requestAnimationFrame(loop);
    };
    this.animFrameId = requestAnimationFrame(loop);
  }

  update(dt) { /* TODO */ }
  draw(ctx) { /* TODO */ }
  showResult() { /* TODO: skills/result-screen.md 참조 */ }
  destroy() { cancelAnimationFrame(this.animFrameId); }
}
```

## 3단계: 데이터 파일 생성

`extension/data/$ARGUMENTS.json`을 생성한다. 게임 유형에 맞는 데이터 구조 템플릿을 작성한다.

grammarRunner라면:
```json
[
  {
    "sentence": "He go to school yesterday",
    "wrongIndex": 1,
    "correct": "went",
    "category": "verb-tense"
  }
]
```

## 4단계: main.js 처리

`extension/main.js`가 존재하면 새 게임 클래스를 등록한다. 없으면 스킵한다.

## 5단계: CLAUDE.md 업데이트

개발 단계 테이블에서 $ARGUMENTS에 해당하는 Phase 상태를 "예정" → "진행중"으로 변경한다.

## 완료 후

생성한 파일 경로를 한 줄씩 출력한다.
