/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        habilite: {
          // Profundo (título/header)
          primary:  '#731906', // RGB(115,25,6)
          // Ação (botões principais/badges)
          accent:   '#da0000', // RGB(218,0,0)
          // Corais/apoio (chips e destaques)
          coral:    '#FF7559', // (corrigido de "#7559")
          peach:    '#FFDFC2', // (corrigido de "#dfc2")
          blush:    '#FF8282', // (corrigido de "#8282")
          pink:     '#FFCCCC', // (corrigido de "#cccc")
        },
      },
    },
  },
  plugins: [],
};
