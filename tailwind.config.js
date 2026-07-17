/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: '#FBEFEF',    // Soft Alabaster (nền chính)
          peach: '#FFE2E2',   // Pastel Peach (nền phụ)
          rose: '#F5CBCB',    // Blush Rose (nút nhấn, viền)
          purple: '#C5B3D3',  // Pastel Lavender (màu nhấn)
          text: '#7C5B8B',    // Plum/Purple đậm cho chữ
          accent: '#A594C1',  // Tím đậm hơn làm điểm nhấn phụ
        }
      },
      fontFamily: {
        serif: ['var(--font-handwriting)', 'cursive'],
        sans: ['var(--font-inter)', 'sans-serif'],
        handwriting: ['var(--font-handwriting)', 'cursive'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'pastel': '0 8px 30px rgb(245, 203, 203, 0.3)',
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
