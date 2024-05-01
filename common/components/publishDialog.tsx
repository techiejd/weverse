import {
  Dialog,
  DialogContent,
  Typography,
  DialogActions,
  Button,
  DialogTitle,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputLabel,
  NativeSelect,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useState, useCallback, useEffect, Fragment, ChangeEvent } from "react";
import { useMyInitiatives, useMyMember } from "../context/weverseUtils";
import LogInPrompt from "./logInPrompt";
import mixpanel from "mixpanel-browser";

const InitiativeNeededDialog = ({
  open,
  close,
}: {
  open: boolean;
  close: () => void;
}) => {
  const [myMember] = useMyMember();
  const t = useTranslations("index.publishDialog.initiativeNeededDialog");
  const inputTranslations = useTranslations("input");
  useEffect(() => {
    if (open) {
      mixpanel.track("Publish Dialog", {
        action: "View",
        dialog: "Initiative Needed",
      });
      mixpanel.track_links(
        "#Publish-Initiative-Needed-Dialog-Actions a",
        "Publish Dialog",
        {
          action: "Submit",
          dialog: "Initiative Needed",
        }
      );
    }
  }, [open]);
  return (
    <Dialog
      open={open}
      onClose={() => {
        mixpanel.track("Publish Dialog", {
          action: "Close",
          dialog: "Initiative Needed",
        });
        close();
      }}
    >
      <DialogTitle>{t("title")}</DialogTitle>
      <DialogContent>
        <Typography>{t("prompt")}</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            mixpanel.track("Publish Dialog", {
              action: "Cancel",
              dialog: "Initiative Needed",
            });
            close();
          }}
        >
          {inputTranslations("cancel")}
        </Button>
        <Button
          variant="contained"
          href={`/${myMember?.path}/initiatives/add?flow=true`}
        >
          {t("publishInitiative")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ChooseInitiativeDialog = ({
  open,
  close,
}: {
  open: boolean;
  close: () => void;
}) => {
  const t = useTranslations("index.publishDialog.chooseInitiativeDialog");
  const inputTranslations = useTranslations("input");
  const [myInitiatives] = useMyInitiatives();
  const [selected, setSelected] = useState("");
  const [nextPage, setNextPage] = useState<string>("/");

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
  };

  useEffect(() => {
    if (selected != "") {
      setNextPage(`/${selected}/actions/upload`);
    }
  }, [selected]);

  useEffect(() => {
    if (myInitiatives && myInitiatives.length > 0) {
      setSelected(myInitiatives[0].path!);
    }
  }, [myInitiatives]);

  useEffect(() => {
    if (open) {
      mixpanel.track("Publish Dialog", {
        action: "View",
        dialog: "Choose Initiative",
      });
      mixpanel.track_links(
        "#Choose-Initiative-Dialog-Actions a",
        "Publish Dialog",
        {
          action: "Submit",
          dialog: "Choose Initiative",
        }
      );
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        mixpanel.track("Publish Dialog", {
          action: "Close",
          dialog: "Choose Initiative",
        });
        close();
      }}
    >
      <DialogTitle>{t("title")}</DialogTitle>
      <DialogContent>
        <Typography>{t("prompt")}</Typography>
        <FormControl fullWidth>
          <InputLabel variant="standard">Initiative</InputLabel>
          <NativeSelect onChange={handleChange} value={selected}>
            {myInitiatives?.map((initiative) => (
              <option value={initiative.path} key={initiative.path}>
                {initiative.name}
              </option>
            ))}
          </NativeSelect>
        </FormControl>
      </DialogContent>
      <DialogActions id="Choose-Initiative-Dialog-Actions">
        <Button
          onClick={() => {
            mixpanel.track("Publish Dialog", {
              action: "Cancel",
              dialog: "Choose Initiative",
            });
            close();
          }}
        >
          {inputTranslations("cancel")}
        </Button>
        <Button variant="contained" disabled={!selected} href={nextPage}>
          {inputTranslations("ok")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const trackSubmit = () =>
  mixpanel.track("Publish Dialog", {
    action: "Submit",
    dialog: "Publish",
  });

const PublishDialog = ({
  open,
  close,
}: {
  open: boolean;
  close: () => void;
}) => {
  const [myMember] = useMyMember();
  const [myInitiatives] = useMyInitiatives();
  const t = useTranslations("index.publishDialog");
  const inputTranslations = useTranslations("input");
  const [publishPromptDialogOpen, setPublishPromptDialogOpen] = useState(false);
  const [initiativeNeededDialogOpen, setInitiativeNeededDialogOpen] =
    useState(false);
  const closePromptAndOpenInitiativeNeededDialog = useCallback(() => {
    trackSubmit();
    setPublishPromptDialogOpen(false);
    setInitiativeNeededDialogOpen(true);
  }, [setPublishPromptDialogOpen, setInitiativeNeededDialogOpen]);
  const [chooseInitiativeDialogOpen, setChooseInitiativeDialogOpen] =
    useState(false);
  const closePromptAndOpenChooseInitiativeDialog = useCallback(() => {
    trackSubmit();
    setPublishPromptDialogOpen(false);
    setChooseInitiativeDialogOpen(true);
  }, [setPublishPromptDialogOpen, setChooseInitiativeDialogOpen]);
  const closeInitiativeNeededDialog = useCallback(() => {
    setInitiativeNeededDialogOpen(false);
    close();
  }, [setInitiativeNeededDialogOpen, close]);
  const closeChooseInitiativeDialog = useCallback(() => {
    setChooseInitiativeDialogOpen(false);
    close();
  }, [setChooseInitiativeDialogOpen, close]);
  useEffect(() => {
    if (open) {
      setPublishPromptDialogOpen(true);
    } else {
      setPublishPromptDialogOpen(false);
      setInitiativeNeededDialogOpen(false);
    }
  }, [open]);
  const [selected, setSelected] = useState<null | "action" | "initiative">(
    null
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.value as "action" | "initiative");
  };

  const [buttonBehavior, setButtonBehavior] = useState<
    {} | { href: string } | { onClick: () => void }
  >({});

  useEffect(() => {
    if (buttonBehavior.hasOwnProperty("href")) {
      mixpanel.track_links("#Publish-Dialog-Actions a", "Publish Dialog", {
        action: "Submit",
        dialog: "Publish",
      });
    }
  }, [buttonBehavior]);

  useEffect(() => {
    switch (selected) {
      case "action":
        switch (myInitiatives?.length) {
          case undefined:
          case 0:
            setButtonBehavior({
              onClick: closePromptAndOpenInitiativeNeededDialog,
            });
            break;
          case 1:
            setButtonBehavior({
              href: `/${myInitiatives[0].path}/actions/upload`,
            });
            break;
          default:
            setButtonBehavior({
              onClick: closePromptAndOpenChooseInitiativeDialog,
            });
        }
        break;
      case "initiative":
        setButtonBehavior({
          href: `/${myMember?.path}/initiatives/add`,
        });
        break;
      default:
        setButtonBehavior({});
    }
  }, [
    closePromptAndOpenChooseInitiativeDialog,
    closePromptAndOpenInitiativeNeededDialog,
    myInitiatives,
    myMember?.path,
    selected,
  ]);

  useEffect(() => {
    if (open) {
      mixpanel.track("Publish Dialog", {
        action: "View",
        dialog: "Publish",
      });
    }
  }, [open]);

  return (
    <Fragment>
      <InitiativeNeededDialog
        open={initiativeNeededDialogOpen}
        close={closeInitiativeNeededDialog}
      />
      <ChooseInitiativeDialog
        open={chooseInitiativeDialogOpen}
        close={closeChooseInitiativeDialog}
      />
      <Dialog
        open={publishPromptDialogOpen}
        onClose={() => {
          close();
        }}
      >
        <DialogTitle>{t("title")}</DialogTitle>
        <DialogContent>
          {myMember ? (
            <FormControl>
              <FormLabel>{t("whatToPublish")}</FormLabel>
              <RadioGroup value={selected} onChange={handleChange}>
                <FormControlLabel
                  value="action"
                  control={<Radio />}
                  label={t("action")}
                />
                <FormControlLabel
                  value="initiative"
                  control={<Radio />}
                  label={t("initiative")}
                />
              </RadioGroup>
            </FormControl>
          ) : (
            <LogInPrompt
              title={t("logInPrompt")}
              exitButtonBehavior={{ onClick: close }}
            />
          )}
        </DialogContent>
        <DialogActions id="Publish-Dialog-Actions">
          <Button
            onClick={() => {
              mixpanel.track("Publish Dialog", {
                action: "Cancel",
                dialog: "Publish",
              });
              close();
            }}
          >
            {inputTranslations("cancel")}
          </Button>
          <Button variant="contained" disabled={!selected} {...buttonBehavior}>
            {inputTranslations("ok")}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default PublishDialog;
