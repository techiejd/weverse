import { useRouter } from "next/router";
import { CircularProgress } from "@mui/material";
import ImpactPage, { PageTypes } from "../../../../modules/posi/impactPage";
import UnderConstruction from "../../../../modules/posi/underConstruction";

const Impact = () => {
  const router = useRouter();
  const { posiId } = router.query;
  return posiId ? (
    <ImpactPage id={String(posiId)} type={PageTypes.impact}>
      <UnderConstruction />
    </ImpactPage>
  ) : (
    <CircularProgress />
  );
};

export default Impact;
