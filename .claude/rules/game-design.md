# Game Design Rules

## 게임 철학

- "생각"이 아니라 "반응" 기반 게임플레이
- 1판 목표 = 10~15초 (너무 길면 안 됨)
- 즉시 시작, 즉시 실패, 즉시 재시작 (메뉴 없음)
- 작업 중 방해 금지 — idle 상태에서만 등장

## 상태 머신 규칙

모든 게임은 아래 상태만 가짐:

```
INIT → RUNNING → FAIL → RESULT → RESTART(→ RUNNING)
```

- `INIT`: 인트로 화면 표시 (규칙 테이블 + 조작법). Space/클릭으로 RUNNING 진입
- 재시작(Play Again)은 INIT을 거치지 않고 곧바로 RUNNING
- 상태 전환은 반드시 `setState(newState)` 함수를 통해서만
- 상태 바깥에서 직접 변수 변경 금지

## GrammarBlitz 게임 규칙 (Shooter)

- 플레이어: 화면 하단 중앙, ← → 키 / 마우스로 좌우 이동
- 문장들이 화면 상단에서 낙하
- Space / 클릭 → 총알 발사 (위쪽)

| 상황 | 오답 문장 (빨강 WRONG) | 정답 문장 (초록 CORRECT) |
|------|----------------------|------------------------|
| 총알로 맞추면 | ✅ 점수 +2 | ❌ 즉시 FAIL |
| 플레이어가 부딪히면 | ❌ 즉시 FAIL | ✅ 점수 +3 (먹기) |
| 바닥 통과(놓치면) | ❌ 즉시 FAIL | ❌ 즉시 FAIL |
- Space / 클릭 → 총알 발사

## 난이도 곡선

- 초반(0~5점): 낙하 속도 느림, 문장 간격 여유
- 중반(5~15점): 속도 증가, 정답 문장 비율 증가 (긴장감)
- 후반(15점+): 최대 속도 유지, 정답/오답 혼합 밀도 높음
- 속도 상한선 필수 (무한 증가 금지)

```js
fallSpeed = Math.min(BASE_FALL + score * 0.1, MAX_FALL)
```

## Canvas 크기

- `CANVAS_WIDTH = 600`, `CANVAS_HEIGHT = 400`, `GROUND_Y = 368` (슈터에 적합한 세로형)
- 반응형: CSS `transform: scale()`로만 조절

## Result Screen 규칙

- 게임 종료 후 0.3초 딜레이 후 표시
- TextBoi CTA 항상 표시 (조건부 숨김 금지)
- "Play Again"은 Space로도 동작
- 최고 점수는 `chrome.storage.local`에 저장 (content script 환경 고려)

## FAIL 원인 설명 (필수)

FAIL 발생 시 Result Screen에 원인 문장과 영어 설명을 반드시 표시한다.

**표시 형식:**
```
❌ You shot a correct sentence!        (정답 격추로 FAIL)
  "She goes to the market every day"
  → 'Goes' is correct — third-person singular needs -s.

또는

💨 You missed a wrong sentence!        (오답 통과로 감점)
  "She go to the market every day"
  → 'Go' → 'goes': third-person singular needs -s.
```

**구현 규칙:**
- FAIL 유발 문장 객체를 `game.failSentence`에 저장해 Result Screen에 전달
- `failReason`: `'shot-correct'` (정답 격추) | `'missed-wrong'` (오답 통과)
- `explanation` 필드는 `grammar.json`에서 로드 (하드코딩 금지)
- 설명 영역은 Result Screen의 고정 영역 — 항상 표시, 빈 경우 없음

## 접근성

- 마우스 클릭/터치로도 총알 발사
- 색맹 대비: 정답/오답 구분에 색상 외 텍스트 레이블 병행

## 데이터 구조 (`grammar.json`)

```json
[
  {
    "sentence": "He went to school yesterday",
    "isCorrect": true
  },
  {
    "sentence": "He go to school yesterday",
    "isCorrect": false,
    "wrongIndex": 1,
    "correct": "went"
  }
]
```

- `isCorrect: true` → 정답 문장 (격추 시 FAIL)
- `isCorrect: false` → 오답 문장 (격추 시 점수)
- 정답 : 오답 비율 = 약 1:2 (정답이 너무 많으면 게임 불가능)
- 최소 정답 15개 + 오답 25개 이상 유지
