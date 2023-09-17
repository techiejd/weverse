import {
  Avatar,
  Button,
  CardActions,
  CardContent,
  Dialog,
  Stack,
  Typography,
} from "@mui/material";
import { Initiative } from "../../functions/shared/src";
import { useLocalizedPresentationInfo } from "../utils/translations";
import { useTranslations } from "next-intl";

const ValidationProcessDialog = ({
  validator,
  open,
  setOpen,
}: {
  validator?: Initiative;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const validatorPresentationInfo = useLocalizedPresentationInfo(validator);
  const t = useTranslations("common.validatorBadge");
  const inputTranslations = useTranslations("input");
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <CardContent>
        <Typography variant="h6">{t("validationProcess")}</Typography>
        <Typography sx={{ whiteSpace: "pre-wrap" }}>
          {validatorPresentationInfo?.validationProcess ||
            t("missingValidationProcess")}
        </Typography>
        <CardActions>
          <Button
            variant="text"
            color="primary"
            href={`/initiatives/${validator?.id}`}
          >
            {t("learnMore")}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => {
              setOpen(false);
              e.stopPropagation();
            }}
          >
            {inputTranslations("ok")}
          </Button>
        </CardActions>
      </CardContent>
    </Dialog>
  );
};
export { ValidationProcessDialog };

const ValidatorBadge = ({ validator }: { validator?: Initiative }) => {
  const t = useTranslations("common");
  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Avatar src={validator?.pic} sx={{ width: 18, height: 18 }} />
      <Typography fontSize={15} fontWeight={600} color="#615F5F">
        {validator?.name || t("loading")}
      </Typography>
    </Stack>
  );
};

export default ValidatorBadge;
