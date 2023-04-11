import { LinkProps, MenuItemProps, PaletteMode, Theme } from "@mui/material";
import { ReactNode, Ref, forwardRef } from "react";
import Link from "next/link";

export const LinkBehavior = forwardRef(function LinkBehaviour(
  props: { href: string },
  ref: Ref<HTMLAnchorElement> | undefined
) {
  return <Link ref={ref} {...props} />;
});

const darkPalette = {
  mode: "dark" as PaletteMode,
  background: {
    default: "#1d3749",
    paper: "#4f171d",
  },
  primary: {
    main: "#FBE39E",
    light: "#FBE7AC",
    dark: "#FADF90",
    contrastText: "black",
  },
  secondary: {
    main: "#254134",
    light: "#2e5241",
    dark: "#1c3127",
    contrastText: "white",
  },
};

const lightPalette = {
  mode: "light" as PaletteMode,
  background: {
    default: "#B6D0E2",
    paper: "#eec4c9",
  },
  primary: {
    main: "#624a04",
    light: "#7a5d05",
    dark: "#493803",
    contrastText: "white",
  },
  secondary: {
    main: "#D4E7DE",
    light: "#DAEBE3",
    dark: "#CEE4D9",
    contrastText: "black",
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
    MuiMenuItem: {
      defaultProps: {
        component: LinkBehavior,
      } as MenuItemProps,
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
