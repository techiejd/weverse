import { PlayCircle, Info, Summarize } from "@mui/icons-material";
import {
  Box,
  Typography,
  Stack,
  Divider,
  CardHeader,
  Icon,
  CardContent,
} from "@mui/material";
import { getSharePropsForPosi, posiFormData } from "../../input/context";
import Support from "./Support";
import { z } from "zod";
import MakerCard from "../../../makers/MakerCard";
import PosiMedia from "./posiMedia";
import { ShareProps } from "../../../../common/components/shareActionArea";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { makerConverter } from "../../../../common/context/weverse";
import { doc } from "firebase/firestore";
import { AppState, useAppState } from "../../../../common/context/appState";
import LoadingFab from "../../../../common/components/loadingFab";

const aboutContentProps = posiFormData.extend({
  support: z.boolean().optional(),
});
export type AboutContentProps = z.infer<typeof aboutContentProps>;

const SupportButton = ({
  shareProps,
  makerId,
}: {
  shareProps: ShareProps;
  makerId: string;
}) => {
  const SupportButtonContent = ({ appState }: { appState: AppState }) => {
    // TODO(techiejd): create a userMaker(id).
    const makerDocRef = doc(appState.firestore, "makers", makerId);
    const [maker, makerLoading, error] = useDocumentData(
      makerDocRef.withConverter(makerConverter)
    );
    return maker ? (
      <Support
        howToSupport={maker.howToSupport ? maker.howToSupport : {}}
        shareProps={shareProps}
      />
    ) : (
      <LoadingFab />
    );
  };

  const appState = useAppState();

  return appState ? (
    <SupportButtonContent appState={appState} />
  ) : (
    <LoadingFab />
  );
};

const AboutContent = ({
  summary,
  video,
  location,
  impactedPeople,
  makerId,
  support,
  id,
}: AboutContentProps) => {
  return (
    <Box>
      <Box sx={{ boxShadow: 1 }} padding={1}>
        <Typography
          variant="h1"
          fontSize={35}
          sx={{ textAlign: "justify", textJustify: "inter-word" }}
        >
          {summary}
        </Typography>{" "}
      </Box>
      <Stack divider={<Divider flexItem />} spacing={1} m={1.5}>
        <Box>
          <CardHeader
            avatar={
              <Icon>
                <PlayCircle />
              </Icon>
            }
            title={"Video"}
          />
          <Box
            sx={{
              height: "50vh",
              width: "100%",
            }}
          >
            <PosiMedia
              video={{
                threshold: 0.9,
                muted: false,
                controls: true,
                controlsList:
                  "play volume fullscreen nodownload noplaybackrate notimeline",
                disablePictureInPicture: true,
                src: video,
              }}
            />
          </Box>
        </Box>
        <Box>
          <CardHeader
            avatar={
              <Icon>
                <Info />
              </Icon>
            }
            title={"Info Rapída"}
          />
          <CardContent>
            <Stack spacing={2}>
              <Stack>
                <Typography variant="h3">
                  {location.structuredFormatting.mainText}
                </Typography>
                <Typography fontSize={10}>
                  {location.structuredFormatting.secondaryText}
                </Typography>
              </Stack>
              <Typography>{impactedPeople.howToIdentify}</Typography>
            </Stack>
          </CardContent>
        </Box>
        <MakerCard makerId={makerId} />
        <Box>
          <CardHeader
            avatar={
              <Icon>
                <Summarize />
              </Icon>
            }
            title={"Descripción detallada de la acción social."}
          />
        </Box>
      </Stack>
      {support && (
        <SupportButton
          shareProps={getSharePropsForPosi({ summary, id })}
          makerId={makerId}
        />
      )}
    </Box>
  );
};

export default AboutContent;
