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
