import { Fragment } from "react";
import Details from "../common/details";
import { useMyMember } from "../../../../common/context/weverseUtils";
import { Box, Button, CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Step } from "./utils";

const Confirm = ({
  sponsorForm,
  handleBack,
}: {
  sponsorForm: Record<string, string>;
  handleBack: () => void;
}) => {
  const [myMember, myMemberError, myMemberLoading] = useMyMember();

  const prevStepLoading =
    sponsorForm[Step.toString(Step.chooseSponsorship)] == "loading";

  const loading = !myMember || prevStepLoading;
  return (
    <Fragment>
      <input hidden value={"confirm"} name="stepString" readOnly />
      <input
        hidden
        value={myMember?.stripe?.subscription ?? ""}
        name="subscription"
        readOnly
      />
      <Details
        sponsorship={sponsorForm as any}
        customerDetails={
          !myMember
            ? undefined
            : {
                ...myMember.customer!,
                country: myMember.customer!.address!.country,
                postalCode: myMember.customer!.address!.postalCode,
              }
        }
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Fragment>
          <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
            <span>Atras</span>
          </Button>
          <LoadingButton
            variant="contained"
            type="submit"
            sx={{ mt: 3, ml: 1 }}
            disabled={loading}
            loading={loading}
          >
            <span>Listo</span>
          </LoadingButton>
        </Fragment>
      </Box>
    </Fragment>
  );
};

export default Confirm;
