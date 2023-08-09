import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

const ThanksForTestimonial = ({
  forMakerId,
  forActionId,
}: {
  forMakerId?: string;
  forActionId?: string;
}) => {
  const thanksTranslations = useTranslations("testimonials.thanks");
  return (
    <Stack sx={{ justifyContent: "center", alignItems: "center" }} spacing={1}>
      <Typography variant="h1">{thanksTranslations("title")}</Typography>
      <Typography>{thanksTranslations("theInformationIsValuable")}</Typography>
      <Typography>{thanksTranslations("thisIsHowWeChangeTheWorld")}</Typography>
      <Typography>{thanksTranslations("whatWouldYouLikeToDoNow")}</Typography>
      {forActionId && (
        <Button href={`/posi/${forActionId}`} variant="contained">
          {thanksTranslations("seeWhatOthersSaidAboutThisAction")}
        </Button>
      )}
      {(forMakerId && (
        <Button href={`/makers/${forMakerId}`} variant="contained">
          {thanksTranslations("seeOtherActionsAndImpactsByMaker")}
        </Button>
      )) || <CircularProgress />}
      <Button href="/" variant="contained">
        {thanksTranslations("goToHomePage")}
      </Button>
    </Stack>
  );
};

export default ThanksForTestimonial;
