import { AppBar, Stack, Toolbar, Typography } from "@mui/material";

export const Header = () => {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography fontSize={"16px"} noWrap>
          🪐 <b>We</b>Verse
        </Typography>
        <div style={{ flexGrow: 1 }}></div>
        <Typography
          sx={{
            mr: 1,
          }}
        >
          LOGIN
        </Typography>
        <Typography
          sx={{
            fontSize: "14px",
            border: 1,
            borderRadius: 1,
            padding: 1,
          }}
        >
          👛 10,000
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
