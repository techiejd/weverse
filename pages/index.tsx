import { Box, Button, ButtonProps, Stack, Typography } from "@mui/material";
import PageTitle from "../common/components/pageTitle";
import AuthDialog from "../modules/auth/AuthDialog";
import { useState } from "react";
import { AuthAction } from "../modules/auth/AuthDialog/context";
import { useAppState } from "../common/context/appState";
import { doc } from "firebase/firestore";
import { User } from "firebase/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Image from "next/image";
import { memberConverter } from "../common/utils/firebase";
import { useTranslations } from "next-intl";
import { WithTranslationsStaticProps } from "../common/utils/translations";

export const getStaticProps = WithTranslationsStaticProps();

const FrontPageButton = (props: ButtonProps) => {
  return (
    <Button
      variant="contained"
      sx={{ width: "100%", maxWidth: 350 }}
      {...props}
    />
  );
};

const MakerPortal = () => {
  const t = useTranslations("index.callToAction.yourMaker");
  const appState = useAppState();
  const { user } = useAppState().authState;
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const MakerPortalBtn = ({ user }: { user: User }) => {
    const memberDocRef = doc(
      appState.firestore,
      "members",
      user.uid
    ).withConverter(memberConverter);
    const [member, loading, error] = useDocumentData(memberDocRef);

    return (
      <FrontPageButton href={`/makers/${member?.makerId}`} disabled={!member}>
        📛 {t("page")}
      </FrontPageButton>
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      <AuthDialog
        open={authDialogOpen}
        setOpen={setAuthDialogOpen}
        initialAuthAction={AuthAction.register}
      />
      <Stack
        sx={{ width: "100%", justifyContent: "center", alignItems: "center" }}
      >
        {user ? (
          <MakerPortalBtn user={user} />
        ) : (
          <FrontPageButton
            onClick={() => {
              setAuthDialogOpen(true);
            }}
          >
            🧑 {t("register")}
          </FrontPageButton>
        )}
      </Stack>
    </Box>
  );
};

const WeVerse = () => {
  const t = useTranslations("index");
  return (
    <Box>
      <Stack
        p={2}
        spacing={2}
        sx={{ width: "100%", justifyContent: "center", alignItems: "center" }}
      >
        <PageTitle
          title={
            <>
              <Image
                src="/logo.png"
                alt="OneWe logo"
                priority
                width={250}
                height={40}
              />
            </>
          }
        />
        <Typography>{t("explanation")}</Typography>
        <Stack
          sx={{ width: "100%", justifyContent: "center", alignItems: "center" }}
        >
          <Typography>{t("callToAction.seeActions")}:</Typography>
          <FrontPageButton href="/posi">
            🤸‍♀️ {t("callToAction.seeActionsButton")}
          </FrontPageButton>
        </Stack>
        <Stack
          sx={{ width: "100%", justifyContent: "center", alignItems: "center" }}
        >
          {t("callToAction.seeMakers")}:
          <FrontPageButton href="/makers">💪 Makers</FrontPageButton>
        </Stack>
        <Stack
          sx={{ width: "100%", justifyContent: "center", alignItems: "center" }}
        >
          <Typography>{t("callToAction.shareAction")}:</Typography>
          <FrontPageButton href="/posi/upload">
            🤸‍♀️ {t("callToAction.shareActionButton")}
          </FrontPageButton>
        </Stack>
        <Stack
          sx={{ width: "100%", justifyContent: "center", alignItems: "center" }}
        >
          <Typography>{t("callToAction.seeYourMaker")}:</Typography>
          <MakerPortal />
        </Stack>
      </Stack>
    </Box>
  );
};

export default WeVerse;
