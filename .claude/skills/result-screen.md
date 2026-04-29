# Skill: Result Screen

게임 종료 후 표시되는 Result Screen 공통 컴포넌트입니다.
모든 게임이 동일한 Result Screen을 사용합니다.

## 표시 내용

```
[FAIL 원인 설명]
  ❌ You shot a correct sentence!
  "She goes to the market every day"
  → 'Goes' is correct — third-person singular needs -s.

Score: {score}  |  Best: {bestScore}

[세션 리뷰 — 이번 게임에서 등장한 최근 5문장]
  ✅ "She goes to the market every day"
     → 'Goes' is correct — ...
  ❌ "He go to school yesterday"
     → 'Go' → 'went': past tense of 'go'.

TextBoi fixes this instantly ⚡

[Try TextBoi →]   [Play Again]

Tip: {randomTip}
```

## HTML 구조

```html
<div id="result">
  <div class="fail-reason">
    <p class="fail-label"></p>
    <p class="fail-sentence"></p>
    <p class="fail-explanation"></p>
  </div>
  <p class="score-msg"></p>
  <div id="review-list"></div>   <!-- JS로 동적 렌더링 -->
  <p class="cta-msg">TextBoi fixes this instantly ⚡</p>
  <div class="buttons">
    <a id="btn-textboi" href="https://textboi.ai" target="_blank">Try TextBoi →</a>
    <button id="btn-replay">Play Again</button>
  </div>
  <p class="tip"></p>
</div>
```

- `.best-score` 별도 요소 없음 — `.score-msg`에 `Score: X | Best: Y` 형식으로 합침
- `#review-list`는 항상 존재, JS가 매 게임마다 innerHTML 덮어씀

## JS 구현

```js
const FAIL_LABELS = {
  'shot-correct':   '❌ You shot a correct sentence!',
  'hit-wrong':      '💥 You ran into a wrong sentence!',
  'missed-wrong':   '💨 You missed a wrong sentence!',
  'missed-correct': '💨 You missed a correct sentence!',
};

_showResult() {
  const best = Math.max(this.score, parseInt(localStorage.getItem('grammarBlitzBest') || '0'));
  localStorage.setItem('grammarBlitzBest', best);

  document.querySelector('.fail-label').textContent = FAIL_LABELS[this.failReason];
  document.querySelector('.fail-sentence').textContent = `"${this.failSentence.sentence}"`;
  document.querySelector('.fail-explanation').textContent = `→ ${this.failSentence.explanation}`;
  document.querySelector('.score-msg').textContent = `Score: ${this.score}  |  Best: ${best}`;
  document.querySelector('.tip').textContent = TIPS[Math.floor(Math.random() * TIPS.length)];
  this._renderReview();
  document.getElementById('result').classList.add('visible');
}

_renderReview() {
  const el = document.getElementById('review-list');
  el.innerHTML = '';
  this.history.slice(-5).forEach(item => {
    // ✅/❌ + sentence + explanation 행 동적 생성
  });
}
```

- `this.history`: 스폰 시점마다 push, 최대 8개 보관, restart 시 초기화
- 리뷰는 최근 5개만 표시, overflow-y: auto (max-height: 140px)

## 입력 처리

- Space 키 → Play Again
- Enter 키 → Play Again
- Click `.btn-replay` → Play Again
- Click `.btn-textboi` → https://textboi.ai 새 탭

## 스타일 요구사항

- 다크 오버레이 (rgba 배경)
- "Try TextBoi" 버튼: 강조 색상 (브랜드 컬러)
- "Play Again" 버튼: 보조 스타일
- 애니메이션: 0.3초 fade-in
