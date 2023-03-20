import { Box, List, ListItem, Typography, Stack } from "@mui/material";
import ImpactPage, { PageTypes } from "../../modules/posi/impactPage";
import CandidateMedia from "../../modules/vote/votingExperience/candidate/candidateMedia";

const Tags = () => {
  return (
    <List>
      <ListItem>
        <Typography>Gender Equality</Typography>
      </ListItem>
    </List>
  );
};

const Maker = () => {
  return (
    <Box>
      <Typography> Mi Barrio Mi Sueño</Typography>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          height: 88,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box flexGrow={1}>
          <Box
            sx={{
              height: "72px",
              width: "100px",
            }}
          >
            <CandidateMedia video={{ threshold: 0.2, src: "/ana14s.mp4" }} />
          </Box>
        </Box>
        <Stack
          sx={{
            alignItems: "center",
            textOverflow: "ellipsis",
            overflow: "hidden",
            minWidth: "0px",
            width: "100%",
          }}
          flexGrow={2}
        >
          <Typography>Medellin, Colombia</Typography>
          <Typography>Foundation</Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

const About = () => {
  return (
    <ImpactPage type={PageTypes.about}>
      <Tags />
      <Maker />
      <Box>Video</Box>
      <Box>Summary</Box>
    </ImpactPage>
  );
};

export default About;
