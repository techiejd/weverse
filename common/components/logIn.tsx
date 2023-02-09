import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { child, push, ref, update } from "firebase/database";
import { MuiTelInput, MuiTelInputInfo } from "mui-tel-input";
import { useEffect, useState } from "react";
import { useAppState, useSetAppState } from "../context/appState";

export const LogInDialog = () => {
  const [phoneNumber, setPhoneNumber] = useState<{
    countryCallingCode?: string | null;
    nationalNumber?: string | null;
  }>({});
  const [phoneNumberIn, setPhoneNumberIn] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const appState = useAppState();
  const setAppState = useSetAppState();

  const onLogIn = () => {
    if (name.length == 0) {
      setNameError(true);
      return;
    }

    if (
      !phoneNumber.countryCallingCode ||
      !phoneNumber.nationalNumber == null ||
      phoneNumber.nationalNumber?.length != 10
    ) {
      setPhoneNumberError(true);
      return;
    }

    if (appState && setAppState) {
      const fullPhoneNumber =
        phoneNumber.countryCallingCode + phoneNumber.nationalNumber;
      const newUserKey = (() => {
        const dbRef = ref(appState.db);
        const newUserKey = push(child(ref(appState.db), "users")).key;
        const updates: Record<string, any> = {};
        updates["/users/" + newUserKey] = {
          phoneNumber: fullPhoneNumber,
          name: name,
        };
        update(dbRef, updates);
        return newUserKey;
      })();

      setAppState({
        ...appState,
        user: {
          id: String(newUserKey),
          phoneNumber: fullPhoneNumber,
          name: name,
        },
        requestLogIn: false,
      });
    }
  };

  const onPhoneNumberChange = (value: string, info: MuiTelInputInfo) => {
    if (info.nationalNumber == null || info.nationalNumber.length <= 10) {
      setPhoneNumber({
        countryCallingCode: info.countryCallingCode,
        nationalNumber: info.nationalNumber,
      });
      setPhoneNumberIn(value);
    }
  };

  return (
    <Dialog
      open={appState ? appState.requestLogIn : false}
      PaperProps={{
        style: {
          borderRadius: 4,
        },
      }}
    >
      <DialogTitle>Subscribe</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Para que tus votos cuenten, por favor haz login con tu nombre y
          numero.
        </DialogContentText>
        <TextField
          error={nameError}
          autoFocus
          margin="dense"
          label="Name"
          fullWidth
          variant="standard"
          onChange={(e) => setName(e.target.value)}
        />
        <MuiTelInput
          defaultCountry="CO"
          continents={["NA", "SA"]}
          value={phoneNumberIn}
          error={phoneNumberError}
          onChange={onPhoneNumberChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onLogIn}>LOGIN</Button>
      </DialogActions>
    </Dialog>
  );
};
