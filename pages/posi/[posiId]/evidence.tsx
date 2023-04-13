import { useRouter } from "next/router";
import ImpactPage, { PageTypes } from "../../../modules/posi/impactPage";
import UnderConstruction from "../../../modules/posi/underConstruction";
import { CircularProgress } from "@mui/material";

const Evidence = () => {
  const router = useRouter();
  const { posiId } = router.query;
  return posiId ? (
    <ImpactPage id={String(posiId)} type={PageTypes.evidence}>
      <UnderConstruction />
    </ImpactPage>
  ) : (
    <CircularProgress />
  );
};

export default Evidence;
