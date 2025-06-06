/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'selector',
  content: ["**/*.md", "docs/.vitepress/theme/**/*.{js,ts,vue}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1rem",
      },
    },
  },
  plugins: [],
}

