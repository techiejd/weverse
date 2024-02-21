import {
  Box,
  Stack,
  Typography,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import AuthDialog, { AuthDialogButton } from "../../modules/auth/AuthDialog";
import { AuthAction } from "../../modules/auth/AuthDialog/context";
import { useTranslations } from "next-intl";
import { sectionStyles } from "./theme";

const LogInPrompt = ({
  title,
  exitButtonBehavior,
}: {
  title: string;
  exitButtonBehavior?: { href: string } | { onClick: () => void };
}) => {
  const [logInDialogOpen, setLogInDialogOpen] = useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const behavior = exitButtonBehavior || { href: "/" };
  const t = useTranslations("common");
  const inputTranslations = useTranslations("input");
  return (
    <Box sx={sectionStyles}>
      <AuthDialog open={logInDialogOpen} setOpen={setLogInDialogOpen} />
      <AuthDialog
        open={registerDialogOpen}
        setOpen={setRegisterDialogOpen}
        initialAuthAction={AuthAction.register}
      />
      <Stack alignItems={"center"} justifyItems={"center"}>
        <Typography variant="h3">{title}</Typography>
        <DialogContentText>{t("logInPrompt")}</DialogContentText>
        <DialogActions>
          <Button {...behavior} size="small">
            {inputTranslations("cancel")}
          </Button>
          <AuthDialogButton setAuthDialogOpen={setLogInDialogOpen} />
          <AuthDialogButton
            setAuthDialogOpen={setRegisterDialogOpen}
            authAction={AuthAction.register}
            buttonVariant="contained"
          />
        </DialogActions>
      </Stack>
    </Box>
  );
};

export default LogInPrompt;
