Extension을 Chrome 로드 가능한 상태로 검증하고 패키징하라.

## 1단계: 필수 파일 존재 확인

아래 파일이 모두 존재하는지 확인한다. 없으면 목록을 출력하고 중단한다:

- `extension/manifest.json`
- `extension/index.html`
- `extension/icon.png`

## 2단계: manifest.json 유효성 검사

`manifest.json`을 읽어서 확인한다:
- JSON 파싱 오류 없음
- `manifest_version`이 3인지
- `chrome_url_overrides.newtab`이 `index.html`을 가리키는지

## 3단계: CDN 참조 검사

`extension/` 하위 모든 `.html`, `.js` 파일을 검색해 외부 URL 참조가 있는지 확인한다:
- `https://` 또는 `http://`로 시작하는 `src=`, `href=` 속성
- `import(` 또는 `fetch(` 에 외부 URL이 있는지
- 발견되면 목록을 출력하고 경고한다 (중단하지는 않음)

## 4단계: CSP 위반 패턴 검사

`extension/` 하위 파일에서 아래 패턴 검색:
- `eval(`
- `new Function(`
- `onclick="`, `onload="` 등 인라인 이벤트 핸들러
- 발견되면 파일명과 줄 수를 출력하고 중단한다

## 5단계: dist 폴더 생성

```bash
rm -rf dist
cp -r extension dist
```

## 6단계: ZIP 생성

```bash
cd dist && zip -r ../grammar-runner-extension.zip . && cd ..
```

## 완료 후

다음을 출력한다:
- 검사 통과 항목 목록
- 경고 항목 (있을 경우)
- `dist/` 경로: Chrome 압축 해제 로드용
- `grammar-runner-extension.zip`: Chrome Web Store 제출용
