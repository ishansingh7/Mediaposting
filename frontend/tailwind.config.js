/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'sans-serif'],
      },
      colors: {
        ink: '#102022',
        mist: '#edf4f1',
        moss: '#5f796e',
        ember: '#f26b4f',
        sun: '#ffc857',
        ocean: '#176b87',
      },
      boxShadow: {
        glow: '0 24px 80px rgba(23, 107, 135, 0.18)',
        card: '0 16px 45px rgba(16, 32, 34, 0.09)',
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(16,32,34,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(16,32,34,.06) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};
