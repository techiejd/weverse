import { Box } from "@mui/material";
import ImpactPage, { PageTypes } from "../../modules/posi/impactPage";

const Comments = () => {
  return (
    <ImpactPage type={PageTypes.about}>
      <Box>Comments</Box>
    </ImpactPage>
  );
};

export default Comments;
