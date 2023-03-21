import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import CitySearchInput from "../../modules/posi/CitySearchInput";
import TagsInput from "../../modules/posi/tagsInput";
import FileInput from "../../modules/posi/fileInput";

const PosiForm = () => {
  const [video, setVideo] = useState<File | undefined>();
  const [img, setImg] = useState<File | undefined>();

  return (
    <form action="/api/posi">
      <TextField
        fullWidth
        label="En una frase, ¿cuál fue tu impacto? (100 caracteres)"
        name="title"
        margin="normal"
        inputProps={{ maxLength: 100 }}
      />
      <TagsInput />
      <CitySearchInput />
      <FileInput
        file={video}
        setFile={setVideo}
        minFileSize={1048576 /** 1MB */}
        maxFileSize={2147483648 /** 2GB */}
        accept={"video"}
      />
      <TextField
        fullWidth
        label="Resumen (1000 caracteres)"
        name="summary"
        multiline
        inputProps={{ maxLength: 1000 }}
      />
      <Typography>Organization</Typography>
      <FileInput
        file={img}
        setFile={setImg}
        maxFileSize={1048576 /** 1MB */}
        accept={"img"}
      />
      <Button variant="contained" sx={{ mt: 3 }} type="submit">
        Subir PoSI!
      </Button>
    </form>
  );
};

export default PosiForm;
