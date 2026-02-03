/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'sport': {
          'red': '#ff2a2a',
          'gold': '#ffbb00',
          'blue': '#1e73be',
          'primary': '#ff2a2a',
          'secondary': '#000000',
          'accent': '#ffbb00',
          'light': '#f6f6f6',
          'dark': '#000000',
          'gray': {
            50: '#f6f6f6',
            100: '#eeeeee',
            200: '#d5d5d5',
            300: '#b0b0b0',
            400: '#8a8a8a',
            500: '#6b6b6b',
            600: '#555555',
            700: '#454545',
            800: '#333333',
            900: '#212529',
          }
        },
      },
      fontFamily: {
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'sport-heading': ['Poppins', 'system-ui', 'sans-serif'],
        'sport-body': ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
