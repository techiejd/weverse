import { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  corePlugins: {
    preflight: false,
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("tailwindcss-themer")({
      themes: [
        {
          name: "bottom-navigation-bar",
          extend: {
            colors: {
              whitesmoke: {
                "100": "#f1f1f1",
                "200": "rgba(246, 246, 246, 0.95)",
              },
              lightgray: "rgba(207, 207, 207, 0.54)",
              "bottom-nav-bar-icons-inactive": "#70607e",
              "bottom-bar-navigation-background": "rgba(244, 244, 244, 0.95)",
              "bottom-bar-navigation-border": "rgba(219, 215, 215, 0.54)",
              black: "#000",
              aliceblue: {
                "100": "rgba(231, 236, 247, 0.5)",
                "200": "rgba(231, 236, 247, 0.4)",
              },
              "blue-0": "#e5f6ff",
              "blue-400": "#0a4966",
              gray: {
                "100": "rgba(255, 255, 255, 0.05)",
                "200": "rgba(255, 255, 255, 0.15)",
                "300": "rgba(255, 255, 255, 0.95)",
                "400": "#8e8e8e",
                "500": "#212121",
                "900": "rgba(2, 13, 14, 0.3)",
                "1000": "rgba(4, 4, 4, 0.5)",
              },
              white: "#fff",
              lightgoldenrodyellow: "#d5ffcc",
              darkblue: "#001cb1",
              lightslategray: "#789cb8",
              ghostwhite: "#f8f9fc",
              slategray: "#82788b",
              indianred: "#c84949",
              dimgray: "rgba(94, 94, 94, 0.5)",
              red: "#fd0000",
              "primary-600": "#7f56d9",
              "gray-500": "#667085",
              "gray-300": "#d0d5dd",
              "gray-700": "#344054",
            },
            fontFamily: {
              "bottom-nav-bar-label-text": "Inter",
              degular: "Degular",
              montserrat: "Montserrat",
            },
            borderRadius: {
              "11xl": "30px",
              xl: "20px",
              "41xl": "60px",
              "2xs": "11px",
              "24xl": "43px",
            },
          },
          fontSize: {
            xs: "0.75rem",
            "2xs": "0.69rem",
            mini: "0.94rem",
            sm: "0.88rem",
            base: "1rem",
            inherit: "inherit",
          },
          screens: {
            lg: {
              max: "1200px",
            },
          },
        },
      ],
    }),
  ],
};

export default config;
