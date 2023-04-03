import { LinkProps, PaletteMode, Theme } from "@mui/material";
import { ReactNode, Ref, forwardRef } from "react";
import Link from "next/link";

const LinkBehavior = forwardRef(function LinkBehaviour(
  props: { href: URL; children: ReactNode },
  ref: Ref<HTMLAnchorElement> | undefined
) {
  const { children, ...other } = props;
  return (
    <Link ref={ref} {...other}>
      {children}
    </Link>
  );
});

const darkPalette = {
  mode: "dark" as PaletteMode,
  background: {
    default: "#1d3749",
    paper: "#4f171d",
  },
  primary: {
    main: "#624a04",
    light: "#7a5d05",
    dark: "#493803",
    contrastText: "white",
  },
  secondary: {
    main: "#254134",
    light: "#2e5241",
    dark: "#1c3127",
  },
};

const lightPalette = {
  mode: "light" as PaletteMode,
  background: {
    default: "#B6D0E2",
    paper: "#eec4c9",
  },
  primary: {
    main: "#FBE39E",
    light: "#FBE7AC",
    dark: "#FADF90",
    contrastText: "black",
  },
  secondary: {
    main: "#D4E7DE",
    light: "#DAEBE3",
    dark: "#CEE4D9",
  },
  info: {
    main: "#624a04",
    light: "#7a5d05",
    dark: "#493803",
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
    MuiAutocompletePaper: {
      styleOverrides: {
        indicator: {
          backgroundColor: "#FFFFFF",
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
  },
};

const lightConfiguration = {
  ...baseConfiguration,
  components: {
    ...baseConfiguration.components,
    MuiBottomNavigationAction: {
      ...baseConfiguration.components.MuiBottomNavigationAction,
      styleOverrides: {
        ...baseConfiguration.components.MuiBottomNavigationAction
          .styleOverrides,
        "&.Mui-selected": {
          backgroundColor: lightPalette.background.default,
        },
      },
    },
  },
  palette: lightPalette,
};

const darkConfiguration = {
  ...baseConfiguration,
  components: {
    ...baseConfiguration.components,
    MuiBottomNavigationAction: {
      ...baseConfiguration.components.MuiBottomNavigationAction,
      styleOverrides: {
        ...baseConfiguration.components.MuiBottomNavigationAction
          .styleOverrides,
        root: {
          "&.Mui-selected": {
            backgroundColor: darkPalette.background.default,
          },
        },
      },
    },
  },
  palette: darkPalette,
};

export const configuration = (prefersDarkMode: boolean) =>
  prefersDarkMode ? darkConfiguration : lightConfiguration;
