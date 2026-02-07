# 영단어 CSV 자동 완성 프롬프트

## 사용 방법:
1. 엑셀에서 CSV 파일 열기
2. english 컬럼에 영어 단어만 입력
3. 아래 프롬프트를 Claude에게 보내기
4. 결과를 복사해서 CSV 파일에 붙여넣기

---

## 프롬프트:

아래 영어 단어들에 대해 CSV 형식으로 정보를 채워주세요.

**대상 단어:**
[여기에 영어 단어 리스트 붙여넣기, 한 줄에 하나씩]
예:
hello
sunny
rainy


**출력 형식:**
```csv
english,korean,partOfSpeech,phonetic,meanings,example1_en,example1_ko,example2_en,example2_ko,status
```

**요구사항:**
1. **korean**: 가장 기본적이고 자주 쓰이는 한국어 뜻 (한 단어로)
2. **partOfSpeech**: 품사 (명사, 동사, 형용사, 부사, 감탄사 등)
3. **phonetic**: IPA 발음기호
4. **meanings**: 주요 뜻 2-3개를 `|`로 구분 (예: "햇빛이 비치는|밝고 명랑한|낙관적인")
5. **example1_en, example1_ko**: 첫 번째 예문과 해석 (초등학생이 이해하기 쉬운 문장)
6. **example2_en, example2_ko**: 두 번째 예문과 해석 (초등학생이 이해하기 쉬운 문장)
7. **status**: "current" (모두 current로)

**주의사항:**
- 큰따옴표로 감싸지 말 것
- meanings 안에 쉼표(,) 사용 금지 (| 만 사용)
- 초등학생 수준에 맞는 쉬운 예문
- 헤더는 출력하지 말고 데이터만 출력

**예시 출력:**
```
hello,안녕,감탄사,/həˈloʊ/,인사말|안녕하세요,Hello! How are you?,안녕하세요! 어떻게 지내세요?,Nice to meet you. Hello!,만나서 반가워요. 안녕!,current
sunny,화창한,형용사,/ˈsʌni/,햇빛이 비치는|밝고 명랑한|낙관적인,It's a sunny day.,화창한 날이에요.,She has a sunny personality.,그녀는 밝은 성격을 가졌어요.,current
```

---

## 프롬프트 (복사용):

```
아래 영어 단어들에 대해 CSV 형식으로 정보를 채워주세요.

**대상 단어:**
[여기에 단어 붙여넣기]

**출력 형식:**
english,korean,partOfSpeech,phonetic,meanings,example1_en,example1_ko,example2_en,example2_ko,status

**요구사항:**
1. korean: 가장 기본적인 한국어 뜻 (한 단어)
2. partOfSpeech: 품사 (명사/동사/형용사/부사/감탄사)
3. phonetic: IPA 발음기호
4. meanings: 주요 뜻 2-3개를 | 로 구분
5. example1_en, example1_ko: 초등학생용 예문 1
6. example2_en, example2_ko: 초등학생용 예문 2
7. status: current

주의: 큰따옴표 사용 금지, meanings에 쉼표 금지 (|만 사용), 헤더 출력 금지, 데이터만 출력
```

