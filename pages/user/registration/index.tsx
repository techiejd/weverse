import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from "next-firebase-auth";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import InterestsIcon from "@mui/icons-material/Interests";

const Registration = () => {
  return (
    <Box>
      <Typography>Por favor registrar:</Typography>
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <ContactPageIcon />
            </ListItemIcon>
            <ListItemText primary="Tu info." />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <InterestsIcon />
            </ListItemIcon>
            <ListItemText primary="Tus intereses." />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})();

export default withAuthUser({})(Registration);
