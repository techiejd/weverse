import { CircularProgress } from "@mui/material";
import { useCurrentMaker } from "../../../modules/makers/context";
import Sponsor from "../../../modules/makers/sponsor";

const SponsorPage = () => {
  const [maker] = useCurrentMaker();
  return maker ? (
    <Sponsor exitButtonBehavior={{ href: "/" }} beneficiary={maker} />
  ) : (
    <CircularProgress />
  );
};

export default SponsorPage;
