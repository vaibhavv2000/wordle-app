/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ["./client/html/tailwind.ejs"],
  theme: {
    extend: {
      colors: {
        primary: "#AE43BC",
        secondary: "#1377FD"
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        sans_pro: ["Source Sans Pro", "sans-serif"],
        sans: ["Open Sans", "sans-serif"]
      },
    },
    screens: {
      xs: "320px",
      sm: "460px",
      md: "768px",
      lg: "996px",
      xl: "1200"
    }
  },
  plugins: [],
}
