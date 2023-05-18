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
import { useAppState, AppState } from "../../common/context/appState";
import { useMaker } from "../../common/context/weverseUtils";
import RatingsStack from "../../common/components/ratings";

const MakerCard = ({ makerId }: { makerId: string }) => {
  const appState = useAppState();
  const MakerCardContent = ({ appState }: { appState: AppState }) => {
    const [value, loading, error] = useMaker(appState, makerId);

    return loading || value == undefined ? (
      <CircularProgress />
    ) : (
      <Stack>
        <Stack direction={"row"} alignItems={"center"} spacing={2}>
          <Avatar src={value.pic} />
          <Typography>{value.name}</Typography>
        </Stack>
        <RatingsStack ratings={value.ratings} />
      </Stack>
    );
  };

  return (
    <Card sx={{ width: "100%" }}>
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
