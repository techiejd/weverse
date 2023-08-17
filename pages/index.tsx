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
import { useMemberConverter } from "../common/utils/firebase";
import { useTranslations } from "next-intl";
import { WithTranslationsStaticProps } from "../common/utils/translations";
import { asOneWePage } from "../common/components/onewePage";

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
  const callToActionTranslations = useTranslations(
    "common.callToAction.yourMaker"
  );
  const appState = useAppState();
  const { user } = useAppState().authState;
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const MakerPortalBtn = ({ user }: { user: User }) => {
    const memberConverter = useMemberConverter();
    const memberDocRef = doc(
      appState.firestore,
      "members",
      user.uid
    ).withConverter(memberConverter);
    const [member, loading, error] = useDocumentData(memberDocRef);

    return (
      <FrontPageButton href={`/makers/${member?.makerId}`} disabled={!member}>
        📛 {callToActionTranslations("page")}
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
            🧑 {callToActionTranslations("register")}
          </FrontPageButton>
        )}
      </Stack>
    </Box>
  );
};

const WeVerse = asOneWePage(() => {
  const indexTranslations = useTranslations("index");
  const commonTranslations = useTranslations("common");
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
        <Typography>{commonTranslations("motto")}</Typography>
        <Stack
          sx={{ width: "100%", justifyContent: "center", alignItems: "center" }}
        >
          <Typography>
            {indexTranslations("callToActionExplanations.actions.list")}:
          </Typography>
          <FrontPageButton href="/posi">
            🤸‍♀️ {commonTranslations("callToAction.actions.list")}
          </FrontPageButton>
        </Stack>
        <Stack
          sx={{ width: "100%", justifyContent: "center", alignItems: "center" }}
        >
          {indexTranslations("callToActionExplanations.seeMakers")}:
          <FrontPageButton href="/makers">
            💪 {commonTranslations("callToAction.listMakers")}
          </FrontPageButton>
        </Stack>
        <Stack
          sx={{ width: "100%", justifyContent: "center", alignItems: "center" }}
        >
          <Typography>
            {indexTranslations("callToActionExplanations.actions.add")}:
          </Typography>
          <FrontPageButton href="/posi/upload">
            🤸‍♀️ {commonTranslations("callToAction.actions.add")}
          </FrontPageButton>
        </Stack>
        <Stack
          sx={{ width: "100%", justifyContent: "center", alignItems: "center" }}
        >
          <Typography>
            {indexTranslations("callToActionExplanations.yourMaker")}:
          </Typography>
          <MakerPortal />
        </Stack>
      </Stack>
    </Box>
  );
});

export default WeVerse;
