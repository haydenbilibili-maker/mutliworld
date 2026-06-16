import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dashboard: {
          bg: '#0A0E17',
          conflict: '#FF4D4F',
          economic: '#52C41A',
          military: '#1890FF',
          neutral: '#BFBFBF',
        },
      },
    },
  },
  plugins: [],
};

export default config;
