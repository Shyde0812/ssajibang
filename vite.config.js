// vite.config.js
export default {
    //root: './src',  // src 폴더를 루트 디렉토리로 설정
    build: {
      outDir: './dist', // 빌드된 파일을 dist 폴더에 저장
    },
    assetsInclude: ['**/*.xml'],  // xml 파일을 에셋으로 포함
    server: {
      open: true,  // 프로젝트 시작 시 브라우저 자동 열기
    },
  };
  