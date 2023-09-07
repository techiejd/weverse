import SentimentVerySatisfied from "@mui/icons-material/SentimentVerySatisfied";
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
import { useInitiative } from "../../common/context/weverseUtils";
import RatingsStack from "../../common/components/ratings";
import { useTranslations } from "next-intl";

const InitiativeCard = ({ initiativeId }: { initiativeId: string }) => {
  const [value, loading] = useInitiative(initiativeId);
  const initiativeCardTranslations = useTranslations("initiatives.card");

  return (
    <Card sx={{ width: "100%" }}>
      <CardActionArea href={`/initiatives/${initiativeId}`}>
        <CardHeader
          avatar={
            <Icon>
              <SentimentVerySatisfied />
            </Icon>
          }
          title={initiativeCardTranslations("title")}
        />
        <CardContent>
          {loading || value == undefined ? (
            <CircularProgress />
          ) : (
            <Stack>
              <Stack direction={"row"} alignItems={"center"} spacing={2}>
                <Avatar src={value.pic} />
                <Typography>{value.name}</Typography>
              </Stack>
              <RatingsStack ratings={value.ratings} />
            </Stack>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default InitiativeCard;
