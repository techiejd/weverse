import CheckBoxOutlineBlank from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBox from "@mui/icons-material/CheckBox";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  DialogActions,
  Button,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";
import { useVipState } from "../../../common/utils/vip";
import { Initiative } from "../../../functions/shared/src";
import { useCurrentActions, useCurrentTestimonials } from "../context";

const VipDialog = ({
  open,
  setOpen,
  setSolicitDialogOpen,
  myInitiative,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setSolicitDialogOpen: Dispatch<SetStateAction<boolean>>;
  myInitiative: Initiative;
}) => {
  const vipDialogTranslations = useTranslations("initiatives.vip.dialog");
  const [actions] = useCurrentActions();
  const [socialProofs] = useCurrentTestimonials();
  const vipState = useVipState(myInitiative, socialProofs, actions);
  return (
    <Dialog open={open}>
      <DialogTitle>{vipDialogTranslations("title")}</DialogTitle>
      <DialogContent>
        <Typography>{vipDialogTranslations("startProcessPrompt")}</Typography>
        <List>
          <ListItemButton
            href={`/${myInitiative.path}/actions/upload`}
            disabled={vipState.oneActionDone}
          >
            <ListItemIcon>
              {vipState.oneActionDone ? <CheckBox /> : <CheckBoxOutlineBlank />}
            </ListItemIcon>
            <ListItemText
              primary={vipDialogTranslations("oneActionDone.primary")}
              secondary={vipDialogTranslations("oneActionDone.secondary")}
            />
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              setOpen(false);
              setSolicitDialogOpen(true);
            }}
            disabled={vipState.enoughSocialProof}
          >
            <ListItemIcon>
              {vipState.enoughSocialProof ? (
                <CheckBox />
              ) : (
                <CheckBoxOutlineBlank />
              )}
            </ListItemIcon>
            <ListItemText
              primary={vipDialogTranslations("getThreeTestimonials.primary")}
              secondary={vipDialogTranslations(
                "getThreeTestimonials.secondary",
                { numSocialProofsDone: vipState.numSocialProofsDoneForVIP }
              )}
            />
          </ListItemButton>
          <ListItemButton
            href={`/${myInitiative.path}/edit`}
            disabled={vipState.allFieldsFinished}
          >
            <ListItemIcon>
              {vipState.allFieldsFinished ? (
                <CheckBox />
              ) : (
                <CheckBoxOutlineBlank />
              )}
            </ListItemIcon>
            <ListItemText
              primary={vipDialogTranslations("finishInitiativeProfile.primary")}
              secondary={
                vipState.allFieldsFinished
                  ? vipDialogTranslations(
                      "finishInitiativeProfile.secondary.finished"
                    )
                  : vipDialogTranslations(
                      "finishInitiativeProfile.secondary.missingTheseFields",
                      { fields: vipState.unfinishedFields!.join(", ") }
                    )
              }
            />
          </ListItemButton>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} autoFocus>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VipDialog;
