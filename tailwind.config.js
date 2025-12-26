/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Basliklar icin Space Grotesk
        display: ['var(--font-space-grotesk)', '"Space Grotesk"', 'sans-serif'],
        // Genel metinler icin Space Grotesk
        sans: ['"Space Grotesk"', 'sans-serif'],
        // Kod ve metinler icin JetBrains Mono
        mono: ['var(--font-jetbrains-mono)', '"JetBrains Mono"', 'monospace'],
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
