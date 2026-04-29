# Skill: Result Screen

게임 종료 후 표시되는 Result Screen 공통 컴포넌트입니다.
모든 게임이 동일한 Result Screen을 사용합니다.

## 표시 내용

```
[FAIL 원인 설명]
  ❌ You shot a correct sentence!
  "She goes to the market every day"
  → 'Goes' is correct — third-person singular needs -s.

Score: {score}   Best: {best}   🔥 New Record!   Max combo: x{n}

[닉네임 입력 — 최초 1회만]
  🏆 Enter your name for the leaderboard (once):
  [________]  [Submit]

[리더보드 — 닉네임 제출/기존 닉네임 자동 제출 후]
  🏆 Leaderboard
  You are #12 on the leaderboard
  #1  Alex    50
  #2  Jin     45
  ...
  #12 You     18  ← 초록 하이라이트

[세션 리뷰 — 최근 5문장]
TextBoi fixes this instantly ⚡
[Try TextBoi →]   [Play Again]
Tip: {randomTip}
```

## 레이아웃 제약

- `#result`는 `position: absolute; inset: 0` — 캔버스(400px) 안에서 스크롤 없이 한 화면에 맞아야 함
- padding: `8px 16px`, gap: `4px` 유지 (더 늘리면 오버플로우 발생)
- `#lb-list` max-height: `140px`, `#review-list` max-height: `80px` (이 이상 키우면 하단 CTA 밀림)

## HTML 구조

```html
<div id="result">  <!-- padding: 8px 16px; gap: 4px; overflow-y: auto -->

  <!-- 2컬럼 그리드 — 전체 너비 -->
  <div id="result-cols">  <!-- grid-template-columns: 1fr 1fr; gap: 8px -->

    <div id="result-left">
      <!-- 닉네임 입력 (최초 1회, display:none → flex) -->
      <div id="nickname-section">...</div>
      <!-- 리더보드 (제출 후, display:none → flex) -->
      <div id="leaderboard-section">
        <p class="lb-title">🏆 Leaderboard</p>
        <p id="lb-rank-msg"></p>   <!-- "You are #N on the leaderboard" -->
        <div id="lb-list"></div>   <!-- Top 50, max-height: 140px, overflow-y: auto -->
      </div>
    </div>

    <div id="result-right">
      <div class="fail-reason">...</div>
      <p class="score-msg"></p>
      <p class="best-msg"></p>      <!-- 🔥 New Record! or Best: N -->
      <p class="combo-msg"></p>     <!-- Max combo: xN (≥2일 때만) -->
      <p class="level-msg"></p>     <!-- Level reached: LvN -->
      <div id="review-list"></div>  <!-- max-height: 80px -->
    </div>

  </div>

  <!-- 전체 너비 — 컬럼 밖 -->
  <p class="cta-msg">TextBoi fixes this instantly ⚡</p>
  <div class="buttons">
    <a id="btn-textboi" href="https://textboi.ai" target="_blank">Try TextBoi →</a>
    <button id="btn-replay">Play Again</button>
  </div>
  <p class="tip"></p>
</div>
```

## JS 구현

`_showResult()`는 **async** 함수다. `setState()`에서 await 없이 호출해도 되며, 리더보드 로딩은 비동기로 처리된다.

```js
// 닉네임 저장 키
const NICK_KEY = 'grammarSmashNickname';

async _showResult() {
  // 1. 로컬 best score 갱신
  // 2. DOM 업데이트 (fail, score, best-msg, combo-msg, review)
  // 3. result.classList.add('visible')
  // 4. 닉네임 분기
  const nickname = localStorage.getItem(NICK_KEY);
  if (!nickname) {
    // 닉네임 입력 폼 표시
    document.getElementById('nickname-section').style.display = 'flex';
  } else {
    await this._submitAndShow(nickname); // 자동 제출 + 랭킹 표시
  }
}

_onNicknameSubmit() {
  const name = input.value.trim().slice(0, 20);
  if (!name) return;
  localStorage.setItem(NICK_KEY, name);
  document.getElementById('nickname-section').style.display = 'none';
  this._submitAndShow(name);
}

async _submitAndShow(nickname) {
  if (this.score > 0) await this._submitScore(nickname); // score=0 제출 생략
  await this._loadLeaderboard(nickname);
}
```

- `this.history`: 스폰 시점마다 push, 최대 8개 보관, restart 시 초기화
- 리뷰는 최근 5개만 표시, overflow-y: auto (max-height: 140px)
- restart 시 `nickname-section`, `leaderboard-section` 모두 `display:none` 리셋

## 입력 처리

- Space 키 → Play Again (**단, `#nickname-input` 포커스 중일 때는 무시**)
- Enter 키 → nickname-input 포커스 시 Submit, 그 외 Play Again
- Click `#btn-submit-nick` → nickname Submit
- Click `#btn-replay` → Play Again
- Click `#btn-textboi` → https://textboi.ai 새 탭

## 스타일 요구사항

- 다크 오버레이 (rgba 배경)
- "Try TextBoi" 버튼: 강조 색상 (브랜드 컬러)
- "Play Again" 버튼: 보조 스타일
- 애니메이션: 0.3초 fade-in
