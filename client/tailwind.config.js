module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lightGray: '#f7fafc',
        black: '#000000',
        white: '#ffffff',
      },
      spacing: {
        64: '16rem', // 64 pixels
      },
    },
  },
  plugins: [],
}