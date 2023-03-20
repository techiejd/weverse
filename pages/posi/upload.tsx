import { Button, TextField } from "@mui/material";
import { useState } from "react";
import CitySearchInput from "../../modules/posi/CitySearchInput";
import SingleVideoInput from "../../modules/posi/singleVideoInput";

const PosiForm = () => {
  const [video, setVideo] = useState<File | undefined>();

  return (
    <form action="/api/posi">
      <TextField
        fullWidth
        label="En una frase, ¿cuál fue tu impacto? (100 caracteres)"
        name="title"
        margin="normal"
        inputProps={{ maxLength: 100 }}
      />
      <CitySearchInput />
      <SingleVideoInput video={video} setVideo={setVideo} />
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
