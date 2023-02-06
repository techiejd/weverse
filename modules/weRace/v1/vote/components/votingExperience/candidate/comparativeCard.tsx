import { Stack, Box, Typography } from "@mui/material";
import { VotingBar } from "./votingBar";

export const ComparativeCard = (props: {
  mediaTitle?: string;
  height: string;
}) => {
  return (
    <Stack spacing={1} sx={{ alignItems: "center" }}>
      <Box
        sx={{
          backgroundColor: "red",
          borderRadius: 4,
          height: props.height,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Box sx={{ backgroundColor: "yellow", flexGrow: 7 }}></Box>
        {props.mediaTitle && (
          <Box
            sx={{
              backgroundColor: "Blue",
              flexGrow: 1,
              alignItems: "center",
              display: "flex",
              paddingLeft: 1,
            }}
          >
            <Typography fontSize="20px">{props.mediaTitle}</Typography>
          </Box>
        )}
      </Box>
      <VotingBar
        sx={{
          height: "48px",
          width: "144px",
        }}
      ></VotingBar>
    </Stack>
  );
};
