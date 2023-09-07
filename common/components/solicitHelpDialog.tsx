import Hearing from "@mui/icons-material/Hearing";
import CardGiftcard from "@mui/icons-material/CardGiftcard";
import ConnectWithoutContact from "@mui/icons-material/ConnectWithoutContact";
import Support from "@mui/icons-material/Support";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Button,
  Typography,
  DialogActions,
} from "@mui/material";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import ShareActionArea from "./shareActionArea";
import { HowToSupport } from "../../functions/shared/src";
import { useTranslations } from "next-intl";

const SolicitDialog = ({
  open,
  setOpen,
  howToSupport,
  pathUnderSupport,
  solicitOpinionPath,
  editMakerPath,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  howToSupport: HowToSupport;
  pathUnderSupport: string;
  solicitOpinionPath: string;
  editMakerPath: string;
}) => {
  const queryKeyExt = `?openSupport=`;
  const dialogTranslations = useTranslations("common.solicitHelpDialog");
  const t = useTranslations("input");
  return (
    <Dialog open={open}>
      <DialogTitle>{dialogTranslations("title")}:</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <ShareActionArea
            shareProps={{
              path: pathUnderSupport + queryKeyExt + "generic",
              title: dialogTranslations("solicit.all.prompt"),
            }}
          >
            <Button variant="outlined" startIcon={<Support />}>
              {dialogTranslations("solicit.all.title")}
            </Button>
          </ShareActionArea>
          <ShareActionArea
            shareProps={{
              path: solicitOpinionPath,
              title: dialogTranslations("solicit.testimonial.prompt"),
            }}
          >
            <Button variant="outlined" startIcon={<Hearing />}>
              {dialogTranslations("solicit.testimonial.title")}
            </Button>
          </ShareActionArea>
          <ShareActionArea
            shareProps={{
              path: pathUnderSupport + queryKeyExt + "sponsor",
              title: dialogTranslations("solicit.sponsorship.prompt"),
            }}
          >
            <Button variant="outlined" startIcon={<CardGiftcard />}>
              {dialogTranslations("solicit.sponsorship.title")}
            </Button>
          </ShareActionArea>
          {howToSupport.contact && (
            <ShareActionArea
              shareProps={{
                path: pathUnderSupport + queryKeyExt + "connect",
                title: dialogTranslations("solicit.connect.prompt"),
              }}
            >
              <Button variant="outlined" startIcon={<ConnectWithoutContact />}>
                {dialogTranslations("solicit.connect.title")}
              </Button>
            </ShareActionArea>
          )}
        </Stack>
        <Typography>
          {dialogTranslations.rich(
            "reminderThatTheyCanSolicitMoreByEditingInitiativePath",
            {
              link: (chunks) => <Link href={editMakerPath}>{chunks}</Link>,
            }
          )}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} autoFocus>
          {t("close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SolicitDialog;
