# 배포 가이드 - GitHub & Vercel

## 🎯 목표
`word-learning-app.jsx` 파일을 웹에 배포하여 링크로 접속 가능하게 만들기

---

## 📁 GitHub에 CSV 파일 관리하기 (ver 0.2 신규)

### CSV 파일 구조

앱에서 자동으로 불러올 CSV 파일을 GitHub에 관리합니다.

```
word-learning-app/
├── data/
│   ├── 진호경.csv
│   ├── 진성운.csv
│   └── 진성율.csv
```

### CSV 파일 생성 방법

#### 방법 1: 엑셀에서 작성
1. 엑셀 열기
2. 다음 형식으로 작성:

| english | korean | type |
|---------|--------|------|
| sunny | 화창한 | current |
| cloudy | 흐린 | current |
| apple | 사과 | review |

3. "다른 이름으로 저장" → CSV UTF-8 선택
4. 파일명: `진성운.csv`

#### 방법 2: 메모장에서 작성
```csv
english,korean,type
sunny,화창한,current
cloudy,흐린,current
apple,사과,review
```

### GitHub에 업로드

1. GitHub repository 접속
2. `data/` 폴더로 이동
3. "Add file" → "Upload files"
4. CSV 파일 드래그 앤 드롭
5. "Commit changes" 클릭

### 파일 수정

1. GitHub에서 해당 CSV 파일 클릭
2. 연필 아이콘 (Edit) 클릭
3. 내용 수정
4. "Commit changes" 클릭
5. 1-2분 후 앱에서 새로고침하면 반영됨

### 앱에서 불러오기

1. 앱 실행
2. 사용자 선택 (예: 진성운)
3. 🔄 **새로고침** 버튼 클릭
4. 팝업에서 선택:
   - **확인**: 기존 단어에 추가
   - **취소**: 완전히 새로 시작
5. 완료!

---

## 📋 준비물
1. GitHub 계정 (없으면 무료 가입)
2. Vercel 계정 (GitHub으로 로그인)
3. `word-learning-app.jsx` 파일

---

## 🚀 배포 과정 (3단계)

### Step 1: GitHub에 업로드 (10분)

#### 1-1. GitHub 가입
1. https://github.com 접속
2. "Sign up" 클릭
3. 이메일, 비밀번호 입력하여 가입

#### 1-2. 새 Repository 만들기
1. GitHub 로그인 후 우측 상단 "+" 버튼 클릭
2. "New repository" 선택
3. 정보 입력:
   - Repository name: `word-learning-app`
   - Description: "초등학생 영단어 학습 앱"
   - Public 선택
   - "Add a README file" 체크
4. "Create repository" 클릭

#### 1-3. 파일 업로드
1. 생성된 repository 페이지에서 "Add file" → "Upload files" 클릭
2. `word-learning-app.jsx` 파일을 드래그 앤 드롭
3. `DEVELOPMENT_HISTORY.md` 파일도 함께 업로드
4. 하단에 "Commit changes" 클릭

---

### Step 2: 프로젝트 설정 파일 추가

GitHub repository에 다음 파일들을 추가로 업로드해야 합니다.

#### 2-1. package.json 파일 생성
```json
{
  "name": "word-learning-app",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.294.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "vite": "^5.0.8"
  }
}
```

#### 2-2. vite.config.js 파일 생성
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

#### 2-3. tailwind.config.js 파일 생성
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### 2-4. postcss.config.js 파일 생성
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

#### 2-5. index.html 파일 생성
```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>영단어 학습 친구</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

#### 2-6. src/main.jsx 파일 생성
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import WordLearningApp from './word-learning-app.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WordLearningApp />
  </React.StrictMode>,
)
```

#### 2-7. src/index.css 파일 생성
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

#### 2-8. 파일 구조
```
word-learning-app/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── DEVELOPMENT_HISTORY.md
└── src/
    ├── main.jsx
    ├── index.css
    └── word-learning-app.jsx  (기존 파일을 여기로 이동)
```

**주의**: `word-learning-app.jsx` 파일을 `src/` 폴더 안으로 이동시켜야 합니다.

---

### Step 3: Vercel로 배포 (5분)

#### 3-1. Vercel 가입
1. https://vercel.com 접속
2. "Sign Up" 클릭
3. "Continue with GitHub" 선택
4. GitHub 계정으로 로그인 승인

#### 3-2. 프로젝트 배포
1. Vercel 대시보드에서 "Add New..." → "Project" 클릭
2. GitHub에서 `word-learning-app` repository 찾기
3. "Import" 클릭
4. 설정 확인 (기본값 사용):
   - Framework Preset: Vite
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. "Deploy" 클릭
6. 배포 완료까지 1-2분 대기

#### 3-3. 배포 완료!
- 배포가 완료되면 URL이 생성됩니다
- 예: `https://word-learning-app-xxxxx.vercel.app`
- 이 링크를 아이들에게 공유하면 됩니다!

---

## 📱 사용 방법

### 각 아이 태블릿 설정
1. 배포된 URL 접속
2. 홈 화면에 북마크 추가
3. 자기 이름 선택해서 사용

### 업데이트 방법
1. GitHub에서 파일 수정
2. Vercel이 자동으로 재배포
3. 링크는 그대로 유지됨

---

## 🔧 문제 해결

### 배포 실패 시
1. GitHub repository에 모든 파일이 있는지 확인
2. `package.json` 파일 내용이 정확한지 확인
3. Vercel 빌드 로그 확인

### 데이터가 사라진 경우
1. 브라우저 캐시 삭제로 인한 것
2. CSV 백업 파일로 복구
3. 앞으로 정기적 백업 권장

### 접속이 안 되는 경우
1. 인터넷 연결 확인
2. 다른 브라우저에서 시도
3. 캐시 삭제 후 재접속

### 중복 단어가 생성되는 경우 (ver 0.2.1에서 수정됨)
**증상**: "이번 주 → 복습 이동" 후 새로고침하면 같은 단어가 양쪽에 모두 생성됨

**해결**: ver 0.2.1 업데이트로 수정됨
- 최신 코드로 재배포 필요
- 기존 중복 단어는 수동 삭제

**임시 해결책** (최신 버전 배포 전):
1. 중복 단어 수동 삭제
2. 또는 "교체" 모드로 새로고침 (기존 데이터 초기화)

### Mac에서 발음이 이상한 경우
**증상**: 쉰 목소리나 저품질 음성으로 재생

**해결**:
1. **시스템 설정** → **손쉬운 사용** → **음성 콘텐츠**
2. **시스템 음성** 클릭
3. **Samantha** (여성, 고품질) 선택
4. 필요시 다운로드
5. 완료!

### GitHub CSV 파일에서 한글이 깨지는 경우
**증상**: 엑셀로 열면 한글이 깨짐

**해결**:
- **방법 1**: GitHub 웹 에디터에서 직접 수정 (추천)
- **방법 2**: Google Sheets 사용
- **방법 3**: 엑셀 Power Query로 UTF-8 인코딩 지정
- **방법 4**: 메모장으로 편집

---

## 💡 팁

### 도메인 변경 (선택사항)
- Vercel에서 프로젝트 이름 변경 가능
- 예: `word-learning-진씨네.vercel.app`

### 성능 최적화
- 이미 최적화되어 있음
- 추가 작업 불필요

### 보안
- HTTPS 자동 적용
- 안전한 접속 보장

---

## 📞 도움이 필요하면

1. Vercel 공식 문서: https://vercel.com/docs
2. GitHub 도움말: https://docs.github.com
3. 또는 Claude에게 질문!

---

## ✅ 체크리스트

배포 전 확인사항:
- [ ] GitHub 계정 생성
- [ ] Repository 생성
- [ ] 모든 파일 업로드 완료
- [ ] data/ 폴더에 CSV 파일 업로드
- [ ] 코드에 GitHub 사용자명 수정
- [ ] Vercel 계정 생성
- [ ] 배포 완료
- [ ] URL 테스트
- [ ] 새로고침 기능 테스트
- [ ] 아이들에게 링크 공유

---

## 🔄 일상 사용 워크플로우 (ver 0.2)

### 선생님 (호경님) 역할:

**매주 또는 필요시:**
1. 엑셀에서 이번 주 단어 작성
2. CSV로 저장 (예: 진성운.csv)
3. GitHub > data/ 폴더에 업로드
4. 아이들에게 "새로고침 해봐" 알림

### 학생 (아이들) 역할:

**학습 시작 시:**
1. 앱 실행
2. 자기 이름 선택
3. 🔄 새로고침 버튼 클릭
4. 새 단어 확인
5. 게임 시작!

---

**다음 작업 시**: 
집에 가서 천천히 이 가이드를 따라하시면 됩니다. 
막히는 부분이 있으면 스크린샷 찍어서 Claude에게 보여주세요!
