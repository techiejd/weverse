import { Box, Divider, Stack } from "@mui/material";
import { asOneWePage } from "../../../../../../common/components/onewePage";
import { CachePaths } from "../../../../../../common/utils/staticPaths";
import { WithTranslationsStaticProps } from "../../../../../../common/utils/translations";
import InitiativeProfile from "../../../../../../modules/initiatives/initiativeProfile";
import InitiativeContent from "../../../../../../modules/initiatives/initiativeContent";
import BottomBar from "../../../../../../modules/initiatives/bottomBar";

export const getStaticPaths = CachePaths;
export const getStaticProps = WithTranslationsStaticProps();

const InitiativePage = asOneWePage(() => {
  return (
    <Box mb={12}>
      <Stack p={2} divider={<Divider />}>
        <InitiativeProfile />
        <InitiativeContent />
      </Stack>
      <BottomBar />
    </Box>
  );
});

export default InitiativePage;
