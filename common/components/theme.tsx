import { LinkProps, PaletteMode } from "@mui/material";
import LinkBehavior from "../utils/linkBehavior";
import { Inter, Montserrat } from "next/font/google";

const interFont = Inter({ subsets: ["latin"] });
const montserratFont = Montserrat({ subsets: ["latin"] });

const darkPalette = {
  mode: "dark" as PaletteMode,
  background: {
    default: "#001849",
    paper: "#682c7f",
  },
  primary: {
    main: "#edb1ff",
  },
  secondary: {
    main: "#c0c1ff",
  },
};

const lightPalette = {
  mode: "light" as PaletteMode,
  background: {
    default: "#fcfcfc",
    paper: "#ffffff",
  },
  primary: {
    main: "#824599",
  },
  secondary: {
    main: "#5355a9",
  },
  info: {
    main: "#824599",
  },
};

const baseConfiguration = {
  components: {
    MuiBottomNavigationAction: {
      styleOverrides: {
        label: {
          fontWeight: "bold",
        },
      },
    },
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      } as LinkProps,
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
    MuiInputLabel: {
      defaultProps: {
        required: false,
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          whiteSpace: "pre-wrap" as any,
        },
      },
    },
  },
  typography: {
    fontFamily: interFont.style.fontFamily,
    h1: {
      fontSize: "3rem",
      fontFamily: montserratFont.style.fontFamily,
      fontWeight: "bold",
    },
    h2: {
      fontSize: "2rem",
      fontFamily: montserratFont.style.fontFamily,
      fontWeight: "bold",
    },
    h3: {
      fontSize: "1.5rem",
    },
    button: {
      textTransform: undefined,
    },
  },
};

export const lightConfiguration = {
  ...baseConfiguration,
  palette: lightPalette,
};

export const sectionStyles = {
  border: 1,
  p: 2,
  m: 2,
  backgroundColor: "#f5f8ff",
  borderRadius: 2,
  borderColor: "#d9e1ec",
};
