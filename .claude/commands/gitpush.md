확인 없이 아래 단계를 순서대로 자동 실행하라. 질문하거나 멈추지 않는다.

## 1단계: 상태 확인

```bash
git status
git diff
```

git이 초기화되지 않은 경우 `git init` 후 remote 설정을 안내하고 중단한다.

## 2단계: 안전 체크

staged 파일 중 아래 항목이 있으면 즉시 unstage하고 경고 후 계속 진행한다:

- `.env`, `.env.local`
- `dist/`, `node_modules/`, `*.zip`
- 하드코딩된 외부 API 키가 포함된 파일

## 3단계: 커밋 메시지 생성

실제 변경 내용을 분석해 아래 형식으로 메시지를 만든다:

```
<type>: <짧은 설명 (영문)>
```

타입 선택 기준:

| 타입 | 사용 시점 |
|------|-----------|
| `game:` | 게임 로직 변경 (`/games/*.js`) |
| `data:` | 게임 데이터 추가/수정 (`/data/*.json`) |
| `feat:` | 새 기능 (새 게임 모드, UI 컴포넌트) |
| `fix:` | 버그 수정 (충돌 판정, 점프 물리, 렌더링) |
| `style:` | 시각적 변경만 (색상, 레이아웃, 폰트) |
| `perf:` | 성능 최적화 (FPS, 로딩 속도) |
| `ext:` | Extension 설정 (`manifest.json`, CSP) |
| `chore:` | 문서, 설정, 도구 변경 |

## 4단계: Stage 및 커밋

```bash
git add .
git commit -m "<생성한 메시지>"
```

## 5단계: Push

```bash
git push
```

원격 브랜치가 없으면:

```bash
git push -u origin main
```

push 실패 시 원인을 분석해서 보고한다. force push는 절대 하지 않는다.

## 완료 후

커밋 해시와 메시지를 한 줄로 출력한다. 그 외 설명은 추가하지 않는다.
