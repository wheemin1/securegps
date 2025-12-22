# SecureNote 로컬 개발 및 배포 워크플로우

## 📋 현재 환경 설정

### Git 저장소 정보
- **GitHub 리포지토리**: https://github.com/wheemin1/securegps.git
- **메인 브랜치**: `main`
- **배포 URL**: https://securenote-gps.netlify.app
- **자동 배포**: GitHub Push → Netlify 자동 빌드

---

## 🚀 로컬 개발 워크플로우

### 1️⃣ 초기 설정 (최초 1회)

#### Git 사용자 정보 설정
```powershell
# Git 사용자 이름 설정
git config --global user.name "Your Name"

# Git 이메일 설정 (GitHub 계정 이메일)
git config --global user.email "your.email@example.com"

# 설정 확인
git config --global user.name
git config --global user.email
```

#### 의존성 설치
```powershell
# 프로젝트 디렉토리로 이동
cd c:\Users\hmkin\securegps

# npm 패키지 설치
npm install
```

---

### 2️⃣ 로컬 개발 서버 실행

```powershell
# 개발 서버 시작 (http://localhost:5173)
npm run dev
```

**개발 서버 특징**:
- ⚡ Hot Module Replacement (HMR) - 코드 수정 시 자동 새로고침
- 🔍 실시간 오류 확인
- 📱 localhost:5173 에서 접근 가능

---

### 3️⃣ 코드 수정 및 테스트

#### 주요 수정 파일 위치
```
client/src/
├── components/        # UI 컴포넌트
│   ├── dropzone.tsx
│   ├── metadata-preview.tsx
│   └── language-selector.tsx
├── utils/            # 핵심 로직
│   ├── metadata-extractor.ts
│   ├── image-processor.ts
│   └── zip-handler.ts
├── hooks/            # React 훅
│   ├── use-image-processor.ts
│   └── use-language.ts
├── i18n/             # 다국어
│   ├── ko.json
│   ├── en.json
│   ├── ja.json
│   └── es.json
└── pages/            # 페이지
    └── home.tsx
```

#### 로컬 테스트 체크리스트
- [ ] 이미지 업로드 테스트 (JPEG, PNG, WebP)
- [ ] GPS 메타데이터 감지 확인
- [ ] 메타데이터 제거 동작 확인
- [ ] 다운로드 기능 테스트
- [ ] 다국어 전환 테스트
- [ ] 반응형 디자인 확인 (모바일/데스크톱)

---

### 4️⃣ 프로덕션 빌드 테스트

```powershell
# 프로덕션 빌드 생성
npm run build:client

# 빌드 결과 미리보기 (http://localhost:4001)
npm run preview
```

**빌드 결과물**:
- `dist/public/` - 배포용 정적 파일
- 최적화된 JavaScript 번들
- 압축된 CSS
- 최적화된 이미지

---

### 5️⃣ Git 커밋 및 푸시

#### 표준 Git 워크플로우

```powershell
# 1. 변경사항 확인
git status

# 2. 변경된 파일 스테이징
git add .

# 또는 특정 파일만 추가
git add client/src/components/dropzone.tsx

# 3. 커밋 (의미있는 메시지 작성)
git commit -m "feat: GPS 좌표 검증 로직 개선"

# 4. GitHub에 푸시
git push origin main
```

#### 커밋 메시지 컨벤션
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅, 세미콜론 누락 등
refactor: 코드 리팩토링
test: 테스트 코드 추가
chore: 빌드 설정, 패키지 업데이트 등

예시:
feat: 메타데이터 미리보기 모달 추가
fix: GPS 좌표 0,0 오탐지 문제 해결
docs: README에 설치 가이드 추가
```

---

### 6️⃣ Netlify 자동 배포

**자동 배포 프로세스**:
```
로컬 코드 수정
    ↓
git commit & push
    ↓
GitHub main 브랜치 업데이트
    ↓
Netlify 자동 감지
    ↓
자동 빌드 시작
    ↓
빌드 성공 시 자동 배포
    ↓
https://securenote-gps.netlify.app 업데이트
```

**배포 확인**:
1. Netlify 대시보드에서 빌드 로그 확인
2. 배포 완료 알림 확인 (GitHub 커밋에 체크마크 표시)
3. 실제 사이트에서 변경사항 확인

---

## 🔄 브랜치 전략 (선택사항)

### Feature 브랜치 사용
```powershell
# 새 기능 개발용 브랜치 생성
git checkout -b feature/gps-accuracy-improvement

# 개발 및 커밋
git add .
git commit -m "feat: GPS 정확도 개선"

# GitHub에 푸시
git push origin feature/gps-accuracy-improvement

# GitHub에서 Pull Request 생성 → 리뷰 → main에 머지
```

### Hotfix 브랜치 (긴급 수정)
```powershell
# 긴급 수정용 브랜치
git checkout -b hotfix/critical-bug

# 수정 및 커밋
git add .
git commit -m "fix: 치명적 버그 긴급 수정"

# 푸시 및 즉시 머지
git push origin hotfix/critical-bug
```

---

## 🛠️ 유용한 명령어 모음

### 개발 서버
```powershell
npm run dev          # 개발 서버 시작
npm run build:client # 프로덕션 빌드
npm run preview      # 빌드 결과 미리보기
npm run check        # TypeScript 타입 체크
```

### Git 명령어
```powershell
git status                    # 현재 상태 확인
git log --oneline -10         # 최근 10개 커밋 확인
git diff                      # 변경사항 비교
git reset --soft HEAD~1       # 마지막 커밋 취소 (변경사항 유지)
git stash                     # 임시 저장
git stash pop                 # 임시 저장한 변경사항 복원
```

### 브랜치 관리
```powershell
git branch                    # 로컬 브랜치 목록
git branch -a                 # 모든 브랜치 목록 (리모트 포함)
git checkout main             # main 브랜치로 이동
git pull origin main          # main 브랜치 최신화
git branch -d feature/old     # 브랜치 삭제
```

---

## 🐛 문제 해결 (Troubleshooting)

### 빌드 오류 발생 시
```powershell
# 1. node_modules 삭제 후 재설치
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install

# 2. 캐시 클리어
npm cache clean --force

# 3. TypeScript 타입 체크
npm run check
```

### Git 푸시 실패 시
```powershell
# 리모트 변경사항 먼저 가져오기
git pull origin main

# 충돌 해결 후 다시 푸시
git push origin main
```

### Netlify 배포 실패 시
1. Netlify 대시보드에서 빌드 로그 확인
2. 빌드 명령어: `npm run build:client`
3. Publish directory: `dist/public`
4. Node 버전: 18 이상

---

## 📊 배포 체크리스트

배포 전 확인사항:
- [ ] 로컬에서 `npm run build:client` 성공
- [ ] `npm run preview`로 빌드 결과 테스트
- [ ] 모든 기능 정상 동작 확인
- [ ] 의미있는 커밋 메시지 작성
- [ ] `git push origin main` 실행
- [ ] Netlify 빌드 로그 확인
- [ ] 배포된 사이트에서 실제 동작 테스트

---

## 🎯 개발 팁

### 효율적인 개발을 위한 팁
1. **작은 단위로 자주 커밋**: 큰 변경사항을 한 번에 커밋하지 말고 작은 단위로 나눠서 커밋
2. **의미있는 커밋 메시지**: 나중에 히스토리를 볼 때 이해하기 쉽게
3. **브랜치 활용**: 실험적인 기능은 별도 브랜치에서 개발
4. **로컬 테스트 철저히**: 푸시 전에 반드시 로컬에서 충분히 테스트
5. **Netlify 빌드 로그 확인**: 배포 후 문제가 없는지 확인

### VS Code 확장 프로그램 추천
- **ESLint**: 코드 품질 검사
- **Prettier**: 자동 포맷팅
- **GitLens**: Git 히스토리 시각화
- **Tailwind CSS IntelliSense**: Tailwind 자동완성
- **TypeScript Error Translator**: 타입 오류 한국어 번역

---

## 📞 도움말

### 문제 발생 시
1. GitHub Issues에 버그 리포트
2. Netlify 대시보드에서 배포 로그 확인
3. 로컬 개발 서버 콘솔 확인

### 유용한 링크
- **GitHub 리포지토리**: https://github.com/wheemin1/securegps
- **배포 사이트**: https://securenote-gps.netlify.app
- **Netlify 대시보드**: https://app.netlify.com/
- **React 문서**: https://react.dev/
- **Vite 문서**: https://vitejs.dev/

---

**마지막 업데이트**: 2025년 12월 22일  
**작성자**: SecureNote Development Team
