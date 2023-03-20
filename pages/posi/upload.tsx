import {
  Button,
  TextField,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
} from "@mui/material";

const PosiForm = () => {
  return (
    <form action="/api/posi">
      <TextField
        fullWidth
        label="En una frase, ¿cuál fue tu impacto? (100 caracteres)"
        name="title"
        margin="normal"
        inputProps={{ maxLength: 100 }}
      />
      <TextField
        fullWidth
        label="Resumen (1000 caracteres)"
        name="summary"
        multiline
        inputProps={{ maxLength: 1000 }}
      />
      <Button variant="contained" sx={{ mt: 3 }} type="submit">
        Subir PoSI!
      </Button>
    </form>
  );
};

export default PosiForm;
