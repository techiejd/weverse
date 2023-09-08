import { LoadingButton } from "@mui/lab";
import { Box, Typography } from "@mui/material";
import { Fragment } from "react";
import { useAppState } from "../../../../common/context/appState";
import { Initiative } from "../../../../functions/shared/src";
import { useTranslations } from "next-intl";

const Final = ({
  exitButtonBehavior,
  loading,
  beneficiary,
}: {
  exitButtonBehavior: { href: string } | { onClick: () => void };
  loading?: boolean;
  beneficiary: Initiative;
}) => {
  const appState = useAppState();
  const thanksTranslations = useTranslations("common.sponsor.thanks");
  return (
    <Fragment>
      <Box>
        <Typography>
          {thanksTranslations("title", {
            sponsorName: appState.authState.user?.displayName,
            beneficiaryName: beneficiary.name,
          })}
        </Typography>
        <Typography>
          {thanksTranslations("togetherYouChangeTheWorld")}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <LoadingButton
          variant="contained"
          sx={{ mt: 3, ml: 1 }}
          {...exitButtonBehavior}
          disabled={loading}
          loading={loading}
        >
          Listo
        </LoadingButton>
      </Box>
    </Fragment>
  );
};

export default Final;
