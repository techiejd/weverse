import { LinkProps, createTheme } from "@mui/material";
import { ReactNode, Ref, forwardRef } from "react";
import Link from "next/link";

const colors = {
  accented: "#BB86FC",
  foreground: "#525252",
  background: "#121212",
  text: "#FFFFFF",
};

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

const theme = createTheme({
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            color: colors.accented,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: colors.accented,
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
  },
  palette: {
    primary: {
      main: colors.background,
    },
    secondary: {
      main: colors.accented,
    },
    background: {
      default: colors.background,
      paper: colors.foreground,
    },
    text: {
      primary: colors.text,
      secondary: colors.text,
    },
  },
});

export default theme;
