export default {
  purge: ["./src/**/*.svelte", "./src/**/*.html"],
  theme: {
    extend: {
      fontFamily: {
        jura: ["Jura", "sans-serif"],
      },
      backgroundColor: {
        "transparent-grey": "rgba(40, 40, 45, 0.2)", // Customize the alpha value to set the transparency level you desire
      },
    },
  },
  variants: {},
  plugins: [],
};
