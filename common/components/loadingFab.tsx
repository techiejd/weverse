import Pending from "@mui/icons-material/Pending";
import { Fab, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

const LoadingFab = () => {
  const t = useTranslations("common");
  return (
    <Fab
      variant="extended"
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
      }}
      color="primary"
    >
      <Pending sx={{ mr: 1 }} />
      <Typography>{t("loading")}</Typography>
    </Fab>
  );
};

export default LoadingFab;
