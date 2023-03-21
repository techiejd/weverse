import { Box } from "@mui/material";
import ImpactPage, { PageTypes } from "../../modules/posi/impactPage";

const Comments = () => {
  return (
    <ImpactPage type={PageTypes.comments}>
      <Box>Comments</Box>
    </ImpactPage>
  );
};

export default Comments;
