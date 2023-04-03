import { useRouter } from "next/router";
import ImpactPage, { PageTypes } from "../../../modules/posi/impactPage";
import UnderConstruction from "../../../modules/posi/underConstruction";
import { CircularProgress } from "@mui/material";

const Comments = () => {
  const router = useRouter();
  const { posiId } = router.query;
  return posiId != undefined ? (
    <ImpactPage id={String(posiId)} type={PageTypes.comments} path="localhost">
      <UnderConstruction />
    </ImpactPage>
  ) : (
    <CircularProgress />
  );
};

export default Comments;
