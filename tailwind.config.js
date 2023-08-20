/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
      fontFamily:{
          inter:['Inter'],
          sans:['Inter'],
          
      }
      ,
      container: {
          padding:{
              sm: '20px',
              md: '20px'
          },
          center:true,
      },
      extend: {
          colors: {
              primary: '#217BF4',
              title: '#0A093D',
              secondary : '#656464',
              blueli : '#171648',
          }
      }
    },
  plugins: [
    require('flowbite/plugin')
  ],
}