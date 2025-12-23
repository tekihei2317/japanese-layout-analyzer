/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      boxShadow: {
        panel: '0 24px 60px -40px rgba(15, 23, 42, 0.45)',
      },
    },
  },
  plugins: [],
};
