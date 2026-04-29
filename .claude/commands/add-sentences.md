인자($ARGUMENTS)로 받은 주제나 개수에 맞는 문법 오류 문장을 생성해 `extension/data/grammar.json`에 추가하라.

## 1단계: 기존 파일 확인

`extension/data/grammar.json`이 존재하면 읽어서 기존 문장 목록을 파악한다. 없으면 빈 배열 `[]`로 시작한다.

## 2단계: 문장 생성

인자가 없으면 카테고리별로 5개씩 (총 30개)을 생성한다.

아래 형식을 엄격하게 따른다:

```json
{
  "sentence": "He go to school yesterday",
  "wrongIndex": 1,
  "correct": "went",
  "category": "verb-tense"
}
```

카테고리 선택 기준:

| 카테고리 | 설명 |
|----------|------|
| `verb-tense` | 동사 시제 오류 |
| `article` | 관사 오류 (a/an/the) |
| `preposition` | 전치사 오류 |
| `subject-verb-agreement` | 주어-동사 수 불일치 |
| `plural` | 복수형 오류 |
| `word-choice` | 단어 선택 오류 |

규칙:
- `wrongIndex`는 `sentence`를 공백으로 split했을 때의 틀린 단어 인덱스 (0부터)
- `correct`는 틀린 단어를 교체할 올바른 단어 하나
- 이미 존재하는 문장과 중복되면 생성하지 않는다
- 인자로 카테고리가 명시되면 해당 카테고리만 생성

## 3단계: 파일 저장

기존 배열에 새 항목을 append해서 저장한다. 전체를 덮어쓰지 않는다.

## 완료 후

추가된 문장 수와 카테고리 분포를 한 줄로 출력한다.
