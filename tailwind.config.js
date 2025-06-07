/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}", // pages 디렉토리의 파일들
    "./components/**/*.{js,ts,jsx,tsx}", // components 디렉토리의 파일들
    "./app/**/*.{js,ts,jsx,tsx}", // app 디렉토리 사용 시
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
