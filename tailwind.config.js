/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        lora: {
          bg: '#F6F7F7',
          primary: '#0A873A',
          dark: '#173E35',
          text: '#1B2332',
          'text-muted': '#94A3B8',
          border: '#E0E6ED',
        }
      },
      fontFamily: {
        InterBold: ["Inter-Bold", "sans-serif"],
        InterSemiBold: ["Inter-SemiBold", "sans-serif"],
        InterMedium: ["Inter-Medium", "sans-serif"],
        InterRegular: ["Inter-Regular", "sans-serif"],
        InterLight: ["Inter-Light", "sans-serif"],
        InterItalic: ["Inter-Italic", "sans-serif"],
      },
    },
  },
  plugins: [],
};
