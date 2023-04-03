import ImpactPage, { PageTypes } from "../../../modules/posi/impactPage";
import UnderConstruction from "../../../modules/posi/underConstruction";

const Evidence = () => {
  return (
    <ImpactPage type={PageTypes.evidence} path="localhost">
      <UnderConstruction />
    </ImpactPage>
  );
};

export default Evidence;
