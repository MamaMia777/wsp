import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          200: '#f0f0f0',
          300: '#e0e0e0',
        },
        blue: {
          200: '#cfd9ff',
          300: '#a1b9ff',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
    textColor: {
      primary: 'hsl(240 3.8% 46.1%)',

    },
    colors: {
      accent: 'hsl(240 4.8% 95.9%)',
      success: "#C1DBAD",
      negative: "#DBADAD"
    },
    fontSize: {
      small: '.875rem',
      medium: '1rem',
      large: '1.875rem'
    },
    lineHeight: {
      large: '2.25rem'
    },
    fontWeight: {
      medium: '500',
      bold: '700',
    }
  },
  plugins: [],
}
export default config
