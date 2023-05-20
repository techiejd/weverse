import { CircularProgress, styled } from "@mui/material";

const CenterBottomCircularProgress = styled(CircularProgress)({
  position: "fixed",
  zIndex: 1,
  bottom: 16,
  left: "50%",
});

export default CenterBottomCircularProgress;
