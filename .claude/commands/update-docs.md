이번 세션에서 변경된 내용을 분석하고 프로젝트 문서를 업데이트하라.

## 1단계: 변경 파일 파악

다음 순서로 변경 내용을 확인한다:
- `git status`와 `git diff HEAD~1 --name-only` 실행 (git이 없으면 스킵)
- 이번 세션에서 생성하거나 수정한 파일 목록을 대화 맥락에서 파악
- `/extension`, `/data`, `/assets` 하위 파일을 중심으로 분석

## 2단계: 변경 유형 분류 후 해당 파일만 수정

아래 기준으로 판단하고, 해당 파일만 수정한다. 변경이 없는 파일은 건드리지 않는다.

| 변경 유형 | 수정할 파일 |
|-----------|------------|
| 새 게임 추가 (`/games/*.js`) | `CLAUDE.md` 개발 단계 테이블 + `rules/game-design.md` |
| 게임 메카닉 변경 (물리, 속도, 점프 수치) | `rules/game-design.md` + `skills/obstacle-system.md` |
| 상태 머신 패턴 변경 | `skills/game-state-machine.md` |
| Result Screen / CTA 동작 변경 | `skills/result-screen.md` |
| 데이터 JSON 구조 변경 (`/data/*.json`) | `CLAUDE.md` 해당 게임 섹션 |
| `manifest.json` 변경 | `CLAUDE.md` manifest 섹션 + `rules/extension-policy.md` |
| 코딩 컨벤션 발견 / 확립 | `rules/coding-style.md` |
| 성능 최적화 패턴 발견 | `rules/coding-style.md` 또는 `rules/extension-policy.md` |
| Phase 상태 전환 (완료/시작) | `CLAUDE.md` 개발 단계 테이블의 상태 칸만 수정 |
| 새 공통 패턴 (규칙 5개 이상) | `skills/` 새 파일 생성 |
| 반복 수동 작업 (3회 이상) | `commands/` 새 파일 생성 |

## 3단계: 수정 원칙

- 전체 파일을 다시 쓰지 않는다. 변경된 섹션만 정확히 수정한다
- 중복 내용은 추가하지 않는다. 기존 항목을 수정하거나 합친다
- `CLAUDE.md`에 상세 규칙을 직접 쓰지 않는다. rules 파일에 위임하고 링크만 유지한다
- "이런 코드를 작성했다"는 내용 금지. "이 규칙을 따른다"는 내용만 문서화한다
- 코드 패턴과 파일 구조는 코드에서 직접 읽을 수 있으므로 문서화하지 않는다

## 4단계: 결과 출력

다음 형식으로 요약한다:

```
### 변경 감지
- [파일명] — [변경 내용 한 줄]

### 업데이트된 문서
- [문서 파일명] — [수정 내용 한 줄]

### 스킵
- [문서 파일명] — 관련 변경 없음

### 새로 생성
- [파일명] (없으면 "없음")
```
