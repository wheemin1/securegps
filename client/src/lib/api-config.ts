// API 설정
export const API_CONFIG = {
  // 환경에 따른 베이스 URL 설정
  BASE_URL: import.meta.env.VITE_API_URL || 
           (import.meta.env.DEV ? 'http://localhost:4001' : ''),
  
  // API 엔드포인트들
  endpoints: {
    upload: '/api/upload',
    process: '/api/process',
    download: '/api/download',
  }
};

// API URL을 생성하는 헬퍼 함수
export function getApiUrl(endpoint: string): string {
  if (endpoint.startsWith('http')) {
    return endpoint; // 절대 URL인 경우 그대로 사용
  }
  
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// 개발 환경 확인
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;
