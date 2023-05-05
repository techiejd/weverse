import { LinkProps, PaletteMode } from "@mui/material";
import { LinkBehavior } from "../context/context";

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
    default: "#ffffff",
    paper: "#fefbff",
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
  },
  typography: {
    h1: {
      fontSize: "3rem",
    },
    h2: {
      fontSize: "2rem",
    },
    h3: {
      fontSize: "1.5rem",
    },
    button: {
      textTransform: undefined,
    },
  },
};

const lightConfiguration = {
  ...baseConfiguration,
  palette: lightPalette,
};

const darkConfiguration = {
  ...baseConfiguration,
  palette: darkPalette,
};

export const configuration = (prefersDarkMode: boolean) =>
  prefersDarkMode ? darkConfiguration : lightConfiguration;
