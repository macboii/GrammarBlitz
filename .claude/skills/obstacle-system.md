# Skill: Falling Sentence System

GrammarBlitz의 낙하 문장 생성 + 총알 충돌 시스템입니다.

## FallingSentence 구조

```js
class FallingSentence {
  constructor(item, x, fallSpeed) {
    this.item = item;           // grammar.json 항목 전체 (explanation 포함)
    this.isCorrect = item.isCorrect;
    this.width = Math.min(item.sentence.length * 7.2 + 24, CANVAS_WIDTH - 40);
    this.height = 34;
    this.x = Math.max(10, Math.min(x, CANVAS_WIDTH - this.width - 10));
    this.y = -this.height;      // 화면 위에서 시작
    this.fallSpeed = fallSpeed; // px/초
    this.passed = false;        // 바닥 통과 처리 완료
    this.hit = false;           // 총알 피격 → 즉시 제거
  }

  update(dt) { this.y += this.fallSpeed * dt; }
  isOffScreen() { return this.y > CANVAS_HEIGHT; }

  collidesBullet(b) {
    return b.x >= this.x && b.x <= this.x + this.width &&
           b.y >= this.y && b.y <= this.y + this.height;
  }
}
```

## 색상 규칙

- `isCorrect: true` → `#15803d` (초록) + 'CORRECT' 레이블
- `isCorrect: false` → `#b91c1c` (빨강) + 'WRONG' 레이블
- 색맹 대비: 색상 + 텍스트 레이블 병행 필수

## 충돌 처리 규칙

```js
// 총알이 문장에 맞았을 때
b.active = false;
s.hit = true;

if (s.isCorrect) {
  // 정답 격추 → 즉시 FAIL
  this.failSentence = s.item;
  this.failReason = 'shot-correct';
  this.setState(GAME_STATE.FAIL);
} else {
  // 오답 격추 → 점수
  this.score += 2;
}

// 오답이 바닥을 통과했을 때
if (!s.isCorrect && s.isOffScreen() && !s.passed) {
  this.failSentence = s.item;
  this.failReason = 'missed-wrong';
  this.score = Math.max(0, this.score - 1);
}
```

## 스폰 로직

```js
_spawnIfReady(dt) {
  this.spawnCooldown -= dt;
  if (this.spawnCooldown > 0) return;
  const x = Math.random() * (CANVAS_WIDTH - 200) + 10;
  this.sentences.push(new FallingSentence(this._nextItem(), x, this.fallSpeed));
  this.spawnCooldown = Math.max(2.5 - this.score * 0.05, 1.2);
}
```

## 상수

```js
const BASE_FALL = 80;    // px/초 (60fps 기준)
const MAX_FALL  = 240;   // px/초 상한
const CANVAS_WIDTH  = 600;
const CANVAS_HEIGHT = 400;
const GROUND_Y = 368;
```

## 업데이트 순서 (중요)

```
sentences.forEach(update) → bullets.forEach(update) → processBulletHits → processMissed → filter
```

- 이동 먼저, 충돌 나중 — 같은 프레임 내 위치 기준
- hit=true 문장은 즉시 제거 (`filter(s => !s.hit && !s.isOffScreen())`)
