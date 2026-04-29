Extension의 자동 검사를 실행하고 해당 Phase의 수동 테스트 체크리스트를 출력하라.

$ARGUMENTS가 비어 있으면 `1`로 간주한다.

## 1단계: 자동 검사 (모든 Phase 공통)

아래 항목을 코드에서 직접 확인하고 ✓/✗로 출력한다:

**파일 존재 여부:**
- `extension/manifest.json`
- `extension/index.html`
- `extension/main.js`
- `extension/game.js`
- manifest.json의 icons 경로 파일 실제 존재

**manifest.json 내용:**
- `manifest_version === 3`
- Phase 1-5 이전: `chrome_url_overrides.newtab` 설정됨 (이후: `action.default_popup`)
- Phase 1-5 이후: `content_scripts` 설정됨, `permissions`에 `storage` 포함

**코드 검사:**
- 외부 CDN 참조 없음 (cdn., unpkg., jsdelivr.)
- `eval()` 사용 없음
- `setInterval` 미사용
- `requestAnimationFrame` 사용 확인

## 2단계: Phase별 수동 테스트 체크리스트 출력

$ARGUMENTS 값에 따라 해당 섹션만 출력한다.

---

### Phase 1 체크리스트 ($ARGUMENTS === 1)

**Chrome 로드:**
```
chrome://extensions/ → 개발자 모드 ON → 새로고침(↺)
→ 새 탭 열기 → GrammarSmash 게임 화면 확인
```

**게임플레이:**
```
[ ] 초록 우주선이 하단 중앙에 렌더링
[ ] ← → 키로 좌우 이동
[ ] Space로 노란 총알 위로 발사
[ ] 캔버스 클릭 → 클릭 위치로 이동 + 발사
[ ] 초록(CORRECT) / 빨강(WRONG) 문장 박스가 위에서 낙하
[ ] 빨강(WRONG) 박스 격추 → Score +2
[ ] 초록(CORRECT) 박스 격추 → 즉시 FAIL
[ ] FAIL 후 0.3초 내 Result Screen 표시
[ ] Result Screen에 실패 원인 레이블 표시 (❌ You shot a correct sentence!)
[ ] Result Screen에 해당 문장 표시
[ ] Result Screen에 영어 설명 표시 (→ 'Goes' is correct — ...)
[ ] "Try TextBoi →" 클릭 → https://textboi.ai 새 탭 오픈
[ ] "Play Again" 클릭 또는 Space → 재시작
[ ] 점수 증가에 따라 낙하 속도 체감 증가
```

**데이터/스토리지:**
```
[ ] DevTools → Application → Local Storage → grammarSmashBest 저장 확인
[ ] DevTools → Network → Offline 후 새 탭 정상 동작 (fallback data 사용)
[ ] DevTools → Network 탭에서 외부 요청 0건 확인
```

---

### Phase 2 체크리스트 ($ARGUMENTS === 2)

**Phase 1 항목 전체 재확인 후 추가 검증:**
```
[ ] 웹 페이지에서 45초 가만히 있으면 Toast 등장 (하단 우측)
[ ] Toast "Play GrammarSmash" 클릭 → 게임 팝업 오픈
[ ] Toast 5초 후 자동 닫힘
[ ] 게임 후 당일 Toast 재노출 안 됨 확인
[ ] 다음 날(또는 DevTools Storage 초기화 후) Toast 다시 등장 확인
[ ] manifest: action.default_popup, content_scripts, storage permission 확인
```

---

### Phase 3 체크리스트 ($ARGUMENTS === 3)

```
[ ] 전체 퍼널 연속 동작: Idle → Toast → 클릭 → Game → FAIL → Result → CTA
[ ] Toast 스타일이 방문 페이지 스타일을 깨지 않음 (Shadow DOM 또는 prefix 확인)
[ ] 팝업 → Result Screen → Play Again → 게임 재시작 정상
[ ] 오프라인 상태에서 팝업 게임 정상 동작
```

---

### Phase 4 체크리스트 ($ARGUMENTS === 4)

```
[ ] extension/ 폴더 zip 압축 후 5MB 이하 확인
[ ] Chrome Extensions 페이지에서 icon.png 128×128 표시
[ ] CWS 개발자 대시보드 업로드 → 패키지 오류 없음
[ ] 스토어 설명 영문 작성 확인
[ ] 스크린샷 1280×800 또는 640×400 준비 확인
```
