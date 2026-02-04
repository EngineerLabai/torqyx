/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Basliklar icin Sora
        display: ['var(--font-display)', '"Sora"', 'sans-serif'],
        // Genel metinler icin Inter
        sans: ['var(--font-sans)', '"Inter"', 'system-ui', 'sans-serif'],
        // Kod ve metinler icin JetBrains Mono
        mono: ['var(--font-mono)', '"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      colors: {
        'neon-green': '#00ff41',
        'dark-bg': '#0a0a0a',
      },
    },
  },
  plugins: [],
};
