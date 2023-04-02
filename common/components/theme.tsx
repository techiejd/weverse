import { LinkProps, Theme } from "@mui/material";
import { ReactNode, Ref, forwardRef } from "react";
import Link from "next/link";

const LinkBehavior = forwardRef(function LinkBehaviour(
  props: { href: URL; children: ReactNode },
  ref: Ref<HTMLAnchorElement> | undefined
) {
  const { href, children, ...other } = props;
  return (
    <Link href={href} passHref>
      <a ref={ref} {...other}>
        {children}
      </a>
    </Link>
  );
});

export const configuration = {
  components: {
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          "&.MuiSelected": ({ theme }: { theme: Theme }) => ({
            backgroundColor: theme.palette.background.default,
          }),
        },
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
  palette: {
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
      main: "#D4E7DE",
      light: "#DAEBE3",
      dark: "#CEE4D9",
    },
  },
};
const lightMode = {
  palette: {
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
  },
};
