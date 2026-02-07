# 🧪 실제 사용 예시

## 1단계: 영어 단어만 입력
```
beautiful
friend
teacher
school
playground
```

## 2단계: Claude에게 보낼 프롬프트
```
아래 영어 단어들을 초등학생용 영단어 학습 앱 CSV로 변환해주세요.

단어 리스트:
beautiful
friend
teacher
school
playground

형식: english,korean,partOfSpeech,phonetic,meanings,example1_en,example1_ko,example2_en,example2_ko,status

규칙:
- korean: 기본 뜻 한 단어
- meanings: 뜻 2-3개를 | 로 구분 (쉼표 금지!)
- 예문: 초등학생이 이해할 수 있는 쉬운 문장
- status: 모두 current
- 큰따옴표 사용 금지
- 헤더 출력 금지, 데이터만 출력

예시:
hello,안녕,감탄사,/həˈloʊ/,인사말|안녕하세요,Hello! How are you?,안녕하세요! 어떻게 지내세요?,Nice to meet you. Hello!,만나서 반가워요. 안녕!,current
```

## 3단계: Claude가 만들어줄 결과 (예상)
```
beautiful,아름다운,형용사,/ˈbjuːtɪfəl/,아름다운|예쁜|멋진,She is beautiful.,그녀는 아름다워요.,What a beautiful day!,정말 아름다운 날이에요!,current
friend,친구,명사,/frend/,친구|벗,He is my best friend.,그는 내 가장 친한 친구예요.,I play with my friends.,나는 친구들과 놀아요.,current
teacher,선생님,명사,/ˈtiːtʃər/,선생님|교사,My teacher is kind.,우리 선생님은 친절하세요.,Our teacher helps us.,선생님이 우리를 도와주세요.,current
school,학교,명사,/skuːl/,학교|학원,I go to school.,나는 학교에 가요.,I like my school.,나는 우리 학교를 좋아해요.,current
playground,놀이터,명사,/ˈpleɪɡraʊnd/,놀이터|운동장,Let's go to the playground!,놀이터에 가자!,The playground is fun.,놀이터는 재미있어요.,current
```

## 4단계: CSV 파일에 붙여넣기
1. Excel/Numbers에서 CSV 파일 열기
2. 헤더 다음 줄에 붙여넣기
3. 저장
4. GitHub 업로드
5. 앱에서 새로고침!

