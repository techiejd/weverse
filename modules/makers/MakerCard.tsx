import { SentimentVerySatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Stack,
  Avatar,
  Typography,
  Card,
  CardHeader,
  Icon,
  CardContent,
  CardActionArea,
} from "@mui/material";
import { doc } from "firebase/firestore";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { useAppState, AppState } from "../../common/context/appState";
import { makerConverter } from "../../common/context/weverse";

const MakerCard = ({ makerId }: { makerId: string }) => {
  const appState = useAppState();
  const MakerCardContent = ({ appState }: { appState: AppState }) => {
    const makerDocRef = doc(appState.firestore, "makers", makerId);
    const [value, loading, error, reload] = useDocumentDataOnce(
      makerDocRef.withConverter(makerConverter)
    );

    return loading || value == undefined ? (
      <CircularProgress />
    ) : (
      <Stack direction={"row"} alignItems={"center"} spacing={2}>
        <Avatar src={value.pic} />
        <Typography>{value.name}</Typography>
      </Stack>
    );
  };

  return (
    <Card>
      <CardActionArea href={`/makers/${makerId}`}>
        <CardHeader
          avatar={
            <Icon>
              <SentimentVerySatisfied />
            </Icon>
          }
          title={"Maker"}
        />
        <CardContent>
          {appState == undefined ? (
            <CircularProgress />
          ) : (
            <MakerCardContent appState={appState} />
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default MakerCard;
