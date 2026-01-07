# SecureNote - GPS 메타데이터 제거 도구

개인정보 보호를 위한 이미지 GPS 메타데이터 제거 및 처리 도구입니다.

## 🌟 주요 기능

- **GPS 메타데이터 감지 및 제거** - 카카오톡 이미지 포함 모든 이미지의 GPS 데이터 처리
- **실시간 진행률 표시** - 처리 과정의 세부 단계별 시각화  
- **메타데이터 미리보기** - 제거 전 GPS 정보 확인 가능
- **다국어 지원** - 한국어, 영어, 일본어, 스페인어 지원
- **대용량 파일 지원** - 웹 워커를 통한 백그라운드 처리
- **일괄 처리** - 여러 이미지 동시 처리 및 ZIP 다운로드
- **향상된 GPS 검증** - 더욱 정확한 메타데이터 검출 시스템

## 🚀 사이드 URL

### 배포된 사이트
[https://securegps.netlify.app/](https://securegps.netlify.app/)

## 🛠️ 기술 스택

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn/ui, Radix UI
- **상태관리**: React Query
- **이미지 처리**: Web Workers, OffscreenCanvas
- **국제화**: 다국어 지원 시스템
- **애니메이션**: Framer Motion

## 📦 로컬 개발 환경 설정

### 필수 요구사항
- Node.js 18+ 
- npm 또는 yarn

```

개발 서버는 `http://localhost:5173`에서 실행됩니다.

## 🌐 Netlify 배포 가이드

### 자동 배포 (권장)

1. **GitHub 연결**
   - Netlify 대시보드에서 "New site from Git" 선택
   - GitHub 저장소 `wheemin1/securegps` 연결

2. **빌드 설정**
   - Build command: `npm run build:client`
   - Publish directory: `dist/public`
   - Node version: `18`

3. **환경 변수 설정** (선택사항)
   ```
   NODE_ENV=production
   VITE_API_URL=https://your-backend-if-needed.com
   ```

### 수동 배포

```bash
# 프로덕션 빌드
npm run build:client

# Netlify CLI로 배포 (선택사항)
npx netlify deploy --prod --dir=dist/public
```

## 📝 빌드 스크립트

- `npm run dev` - 개발 서버 실행
- `npm run build:client` - 프론트엔드만 빌드 (Netlify용)
- `npm run build:server` - 서버만 빌드
- `npm run build` - 풀스택 빌드
- `npm run preview` - 빌드 결과 미리보기

## 🔧 프로젝트 구조

```
├── client/                 # 프론트엔드 (React)
│   ├── src/
│   │   ├── components/     # UI 컴포넌트
│   │   ├── hooks/          # React 훅
│   │   ├── utils/          # 유틸리티 함수
│   │   ├── workers/        # 웹 워커
│   │   └── i18n/          # 다국어 지원
├── server/                 # 백엔드 (Express) - 선택사항
├── shared/                 # 공유 타입/스키마
├── netlify.toml           # Netlify 배포 설정
└── package.json
```

## 🌍 지원 언어

- 🇰🇷 한국어 (Korean)
- 🇺🇸 영어 (English) 
- 🇯🇵 일본어 (Japanese)
- 🇪🇸 스페인어 (Spanish)

## 📱 지원 브라우저

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 🔒 개인정보 보호

- **클라이언트 사이드 처리**: 모든 이미지 처리는 브라우저에서 수행
- **서버 전송 없음**: 이미지가 외부 서버로 전송되지 않음
- **메타데이터 완전 제거**: GPS, EXIF 데이터 완전 삭제
- **임시 파일 없음**: 처리된 결과만 다운로드

## 🐛 문제 해결

### 일반적인 문제

1. **이미지가 처리되지 않는 경우**
   - 지원되는 형식인지 확인 (JPEG, PNG, WebP)
   - 파일 크기가 적절한지 확인
   - 브라우저 콘솔에서 에러 메시지 확인

2. **언어 변경이 적용되지 않는 경우**
   - 페이지 새로고침 시도
   - 브라우저 캐시 삭제

3. **다운로드가 안 되는 경우**
   - 팝업 차단 설정 확인
   - 다운로드 권한 허용

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 지원

문제나 제안사항이 있으시면:
- [GitHub Issues](https://github.com/wheemin1/securegps/issues)에 등록
- [GitHub Discussions](https://github.com/wheemin1/securegps/discussions)에 참여

---

**보안과 개인정보 보호를 최우선으로 하는 이미지 메타데이터 제거 도구**
