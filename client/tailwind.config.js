module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blueDark: '#090446',
        blueLight: '#7360E8',
        blueVeryLight: '',
      },
      screens: {
        xsm: '360px',
        sm: '480px',
        md: '768px',
        lg: '976px',
        xlg: '1176px',
        xl: '1440px',
        xxl: '1640px',
      },
      fontSize: {
        '4xl': '2.50rem', // 3 Extra Large
      }
    },
  },
  plugins: [],
}



/** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     './pages/**/*.{js,ts,jsx,tsx,mdx}',
//     './components/**/*.{js,ts,jsx,tsx,mdx}',
//     './app/**/*.{js,ts,jsx,tsx,mdx}',
//   ],
//   theme: {
//     extend: {
//       backgroundImage: {
//         'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
//         'gradient-conic':
//           'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
//       },
//       screens: {
//         xsm: '360px',
//         sm: '480px',
//         md: '768px',
//         lg: '976px',
//         xl: '1440px',
//         xxl: '1640px',
//       },
//       colors: {
//         blueDark: '#090446',
//         blueLight: '#3165f4d8',
//       },
//       boxShadow: {
//         'darkGrayShadow': '0 0 7px 0px #00000026',
//         'lightGrayShadow': '0 0 10px 0px #00000030',
//         'veryLightGrayShadow': '0 0 8px 0px #00000030',
//       },
//     },
//   },
//   plugins: [],
// }
