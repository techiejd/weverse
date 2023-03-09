import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from "next-firebase-auth";
import { Box, Typography } from "@mui/material";

const Registration = () => {
  return (
    <Box>
      <Typography>Hello World</Typography>
    </Box>
  );
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})();

export default withAuthUser({})(Registration);
