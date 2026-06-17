import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      zIndex: {
        '25': '25',
        '35': '35',
      },
      colors: {
        dashboard: {
          bg: '#0A0E17',
          conflict: '#FF4D4F',
          economic: '#52C41A',
          military: '#1890FF',
          neutral: '#BFBFBF',
        },
        // 万象幻测 · OmniLens 品牌色（青金 · 中国视角）
        brand: {
          ink: '#0A0E17', // 深空墨
          gold: '#E8B563', // 鎏金
          'gold-bright': '#F4D08A',
          cyan: '#3FC8E0', // 钴青
          'cyan-deep': '#1B6E8C',
        },
      },
    },
  },
  plugins: [],
};

export default config;
