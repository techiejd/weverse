/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#fff",
        gray: {
          "100": "rgba(255, 255, 255, 0.05)",
          "200": "rgba(255, 255, 255, 0.15)",
          "300": "rgba(255, 255, 255, 0.95)",
        },
        dimgray: "rgba(94, 94, 94, 0.5)",
        "bottom-nav-bar-icons-inactive": "#70607e",
      },
      fontFamily: {
        "bottom-nav-bar-label-text": "Inter",
      },
    },
    fontSize: {
      xs: "0.75rem",
      inherit: "inherit",
    },
    screens: {
      lg: {
        max: "1200px",
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
}

