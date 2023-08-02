import { Stack, Divider, Typography, Rating } from "@mui/material";
import { Ratings } from "../../functions/shared/src";
import { useTranslations } from "next-intl";

const RatingsStack = ({ ratings }: { ratings: Ratings | undefined }) => {
  const t = useTranslations("actions");
  return (
    <Stack
      direction={"row"}
      spacing={2}
      divider={<Divider orientation="vertical" flexItem />}
    >
      <Stack direction={"row"}>
        <Typography ml={1} mr={2}>
          🙋
        </Typography>
        <Typography color={"grey"}>{t("testimonials")}:</Typography>
        <Typography ml={2}>{ratings ? ratings.count : 0}</Typography>
      </Stack>
      <Rating value={ratings ? ratings.sum! / ratings.count! : null} readOnly />
    </Stack>
  );
};

export default RatingsStack;
