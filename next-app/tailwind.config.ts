import type { Config } from 'tailwindcss'

const config: Config = {
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
    },
    fontFamily: {
      cabin: ['Cabin', 'sans-serif'],
      'hind-siliguri': ['Hind Siliguri', 'sans-serif'],
      robotoslab: ['Roboto Slab', 'serif'],
    },
    colors: {
      primary: "#F3EEEA",
      secondary: "#EBE3D5",
      tertiary: "#B0A695",
      quaternary: "#776B5D",
      black: "#000000",
      purple: "#7743DB",
      lightpurple: "#C3ACD0",
      red: "#FFB8B8",
      yellow: "#FFF9C2",
      green: "#C2FFC9",
    },

    backgroundImage: {
      'hero-img': "url('/hero.jpg')",
    },
  },
  plugins: [],
}
export default config
