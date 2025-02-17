module.exports = {
  preset: 'ts-jest',            // ts-jest를 사용하여 TypeScript 파일을 처리
  testEnvironment: 'jsdom',     // DOM 환경을 사용할 경우
  testMatch: ['**/*.test.ts'], // 테스트할 파일 패턴
  isolatedModules: true,
};