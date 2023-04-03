import ImpactPage, { PageTypes } from "../../../modules/posi/impactPage";
import UnderConstruction from "../../../modules/posi/underConstruction";

const Comments = () => {
  return (
    <ImpactPage type={PageTypes.comments} path="localhost">
      <UnderConstruction />
    </ImpactPage>
  );
};

export default Comments;
