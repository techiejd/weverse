import { LinkProps, createTheme } from "@mui/material";
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
    MuiTab: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            color: "#FFFFFF",
          },
        },
      },
    },
    MuiTabs: {
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
