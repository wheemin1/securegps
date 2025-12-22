# 빠른 시작 가이드

## 🚀 로컬 개발 시작하기

### 1. 개발 서버 실행
```powershell
npm run dev
```
브라우저에서 http://localhost:5173 열기

### 2. 코드 수정
- `client/src/` 폴더에서 파일 수정
- 저장하면 자동으로 브라우저 새로고침

### 3. 배포하기
```powershell
# 변경사항 커밋
git add .
git commit -m "feat: 기능 설명"

# GitHub에 푸시 (자동 배포 시작)
git push origin main
```

### 4. 배포 확인
- Netlify에서 자동 빌드/배포
- https://securenote-gps.netlify.app 에서 확인

---

## 📁 자주 수정하는 파일

### UI 변경
- `client/src/components/dropzone.tsx` - 파일 업로드 UI
- `client/src/components/metadata-preview.tsx` - 메타데이터 미리보기
- `client/src/pages/home.tsx` - 메인 페이지

### 기능 수정
- `client/src/utils/metadata-extractor.ts` - 메타데이터 추출
- `client/src/utils/image-processor.ts` - 이미지 처리
- `client/src/hooks/use-image-processor.ts` - 이미지 처리 훅

### 번역 추가
- `client/src/i18n/ko.json` - 한국어
- `client/src/i18n/en.json` - 영어
- `client/src/i18n/ja.json` - 일본어
- `client/src/i18n/es.json` - 스페인어

---

## 🛠️ 유용한 명령어

```powershell
npm run dev              # 개발 서버
npm run build:client     # 빌드
npm run preview          # 빌드 미리보기
npm run check            # 타입 체크
git status               # Git 상태
git log --oneline -5     # 최근 커밋
```

---

더 자세한 내용은 **DEV_WORKFLOW.md** 참고!
