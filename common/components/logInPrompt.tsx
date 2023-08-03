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

const LogInPrompt = ({
  title,
  setOpen,
}: {
  title: string;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const [logInDialogOpen, setLogInDialogOpen] = useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const behavior = setOpen
    ? {
        onClick: () => {
          setOpen(false);
        },
      }
    : { href: "/" };
  const t = useTranslations("common");
  const inputTranslations = useTranslations("input");
  return (
    <Box
      sx={{
        border: 1,
        p: 2,
        m: 2,
        backgroundColor: "#f5f8ff",
        borderRadius: 2,
        borderColor: "#d9e1ec",
      }}
    >
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
