import { createTheme } from "@mui/material";

const colors = {
  accented: "#BB86FC",
  foreground: "#525252",
  background: "#121212",
  text: "#FFFFFF",
};

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
