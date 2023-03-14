import { Box, Link, Typography } from "@mui/material";

const VotingPortal = () => {
  return (
    <Box>
      <Typography>
        Hey! Sign in and register to participate in the OneWe Awards!
      </Typography>
      <Typography>
        Or take a <Link href="/vote">sneek-peak</Link>.
      </Typography>
    </Box>
  );
};

export default VotingPortal;
