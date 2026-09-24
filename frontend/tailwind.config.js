/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#0C1215',
          card: '#131D21',
          hover: '#1C2A30',
          darker: '#080C0E',
        },
        pine: {
          950: '#0A0F12',
          900: '#0E1519',
          800: '#131D21',
          700: '#1C2A30',
          600: '#22353A',
          500: '#2D444A',
          400: '#3D5C64',
        },
        sage: {
          50: '#F4F8F1',
          100: '#E6F0DF',
          200: '#CFE2C3',
          300: '#AFD19B', // Primary Electric Pale Sage
          400: '#8EB878',
          500: '#628E6A', // Lush Moss
          600: '#486E4F',
          700: '#335239',
          800: '#254E41', // Deep Pine
          900: '#16271A',
        },
        tactical: {
          border: '#22353A',
          borderBright: 'rgba(175, 209, 155, 0.25)',
          amber: '#E5A93C',
          crimson: '#F43F5E',
        },
        brand: {
          50: '#f4f8f1',
          100: '#e6f0df',
          500: '#628e6a',
          600: '#486e4f',
          700: '#335239',
          900: '#254e41',
        },
      },
      boxShadow: {
        'tactical-glow': '0 0 20px rgba(175, 209, 155, 0.22)',
        'tactical-glow-lg': '0 0 32px rgba(175, 209, 155, 0.35)',
        'amber-glow': '0 0 20px rgba(229, 169, 60, 0.25)',
        'crimson-glow': '0 0 20px rgba(244, 63, 94, 0.25)',
      },
      transitionDuration: {
        DEFAULT: '80ms',
        '80': '80ms',
      },
    },
  },
  plugins: [],
}
