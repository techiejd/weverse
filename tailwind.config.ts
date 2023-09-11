import { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        aliceblue: {
          "100": "#e7ecf7",
          "200": "rgba(231, 236, 247, 0.5)",
          "300": "rgba(231, 236, 247, 0.4)",
        },
        darkblue: "#001cb1",
        black: "#000",
        gray: {
          "100": "#212121",
          "200": "rgba(4, 4, 4, 0.3)",
          "300": "rgba(2, 13, 14, 0.5)",
          "400": "rgba(2, 13, 14, 0.3)",
          "500": "rgba(4, 4, 4, 0.5)",
        },
        "blue-0": "#e5f6ff",
        "blue-400": "#0a4966",
        darkred: "rgba(143, 9, 9, 0.5)",
        white: "#fff",
        lightgoldenrodyellow: "#d5ffcc",
        whitesmoke: "#f3f3f3",
        lightslategray: "#789cb8",
        darkgray: "rgba(163, 150, 150, 0.8)",
      },
      spacing: {},
      fontFamily: {
        "card-body-text": "Inter",
      },
      borderRadius: {
        "2xl": "21px",
        xl: "20px",
        "11xl": "30px",
        "2xs": "11px",
        "41xl": "60px",
      },
    },
    fontSize: {
      xs: "12px",
      base: "16px",
      inherit: "inherit",
    },
    screens: {
      lg: {
        max: "1200px",
      },
      md: {
        max: "960px",
      },
      sm: {
        max: "420px",
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
};

export default config;
