/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      screens: {
        'sm': '576px',   // Small devices (e.g., phones) - 576px and up
        'md': '768px',   // Medium devices (e.g., tablets) - 768px and up
        'lg': '992px',   // Large devices (e.g., laptops) - 992px and up
        'xl': '1200px',  // Extra large devices (e.g., desktops) - 1200px and up
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        jost: ['Jost', 'sans-serif'],
        bebas_neue: ['Bebas Neue', 'cursive'],
      },
    },
  },
  daisyui: {
    themes: ["light"],
  },
  plugins: [require("daisyui")],
}
