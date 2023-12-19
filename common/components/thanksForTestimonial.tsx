import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useCurrentPosi } from "../../modules/posi/context";
import { useCurrentInitiative } from "../../modules/initiatives/context";

const ThanksForTestimonial = () => {
  const [forAction] = useCurrentPosi();
  const [forInitiative] = useCurrentInitiative();
  const thanksTranslations = useTranslations("testimonials.thanks");
  return (
    <Stack sx={{ justifyContent: "center", alignItems: "center" }} spacing={1}>
      <Typography variant="h1">{thanksTranslations("title")}</Typography>
      <Typography>{thanksTranslations("theInformationIsValuable")}</Typography>
      <Typography>{thanksTranslations("thisIsHowWeChangeTheWorld")}</Typography>
      <Typography>{thanksTranslations("whatWouldYouLikeToDoNow")}</Typography>
      {forAction && (
        <Button href={`/${forAction.path}`} variant="contained">
          {thanksTranslations("seeWhatOthersSaidAboutThisAction")}
        </Button>
      )}
      {(forInitiative && (
        <Button href={`/${forInitiative.path}`} variant="contained">
          {thanksTranslations("seeOtherActionsAndImpactsByThisInitiative")}
        </Button>
      )) || <CircularProgress />}
      <Button href="/" variant="contained">
        {thanksTranslations("goToHomePage")}
      </Button>
    </Stack>
  );
};

export default ThanksForTestimonial;
