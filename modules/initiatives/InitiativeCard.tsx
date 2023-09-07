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
import { useMaker } from "../../common/context/weverseUtils";
import RatingsStack from "../../common/components/ratings";
import { useTranslations } from "next-intl";

const InitiativeCard = ({ makerId }: { makerId: string }) => {
  const [value, loading] = useMaker(makerId);
  const initiativeCardTranslations = useTranslations("initiatives.card");

  return (
    <Card sx={{ width: "100%" }}>
      <CardActionArea href={`/initiatives/${makerId}`}>
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
