import { Box } from "@mui/material";
import ImpactPage, { PageTypes } from "../../modules/posi/impactPage";

const About = () => {
  return (
    <ImpactPage type={PageTypes.about}>
      <Box>About</Box>
    </ImpactPage>
  );
};

export default About;
