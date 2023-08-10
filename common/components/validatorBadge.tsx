import {
  Avatar,
  Button,
  CardActions,
  CardContent,
  Dialog,
  Stack,
  Typography,
} from "@mui/material";
import { Maker } from "../../functions/shared/src";

const ValidationProcessDialog = ({
  validator,
  open,
  setOpen,
}: {
  validator?: Maker;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <CardContent>
        <Typography variant="h6">Proceso de validación</Typography>
        <Typography sx={{ whiteSpace: "pre-wrap" }}>
          {validator?.validationProcess ||
            "La incubadora no ha subido su proceso de validación"}
        </Typography>
        <CardActions>
          <Button
            variant="text"
            color="primary"
            href={`/makers/${validator?.id}`}
          >
            Ver página de la incubadora.
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => {
              setOpen(false);
              e.stopPropagation();
            }}
          >
            Entendido
          </Button>
        </CardActions>
      </CardContent>
    </Dialog>
  );
};
export { ValidationProcessDialog };

const ValidatorBadge = ({ validator }: { validator?: Maker }) => {
  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Avatar src={validator?.pic} sx={{ width: 18, height: 18 }} />
      <Typography fontSize={15} fontWeight={600} color="#615F5F">
        {validator?.name || "Espere un momento"}
      </Typography>
    </Stack>
  );
};

export default ValidatorBadge;
