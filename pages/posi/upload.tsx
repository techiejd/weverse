import {
  Button,
  CardMedia,
  TextField,
  Input,
  Box,
  Typography,
} from "@mui/material";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

const SingleVideoUpload = ({
  video,
  setVideo,
}: {
  video: File | undefined;
  setVideo: Dispatch<SetStateAction<File | undefined>>;
}) => {
  const [error, setError] = useState("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError("");
    const MIN_FILE_SIZE = 1048576; // 1MB
    const MAX_FILE_SIZE = 2147483648; // 2 GB

    if (e.target.files) {
      const fileSelectionWasCanceled = e.target.files.length == 0;
      if (fileSelectionWasCanceled && video) {
        setVideo(undefined);
        return;
      }

      const file = e.target.files[0];

      if (file.size < MIN_FILE_SIZE || file.size > MAX_FILE_SIZE) {
        setVideo(undefined);
        e.target.value = "";
        setError(
          file.size < MIN_FILE_SIZE
            ? "Video is too short. Must be greater than 1 mb."
            : "Video is too long. Must be shorter than 2GB"
        );
      }

      setVideo(e.target.files[0]);
    }
  };

  return (
    <Box>
      {error != "" && (
        <Typography sx={{ color: "red" }}>Error: {error}</Typography>
      )}
      <Input
        type="file"
        onChange={handleFileChange}
        slotProps={{ input: { accept: "video/mp4" } }}
        error
      />
      {video && (
        <CardMedia
          sx={{
            height: 200,
            width: 200,
          }}
          component="video"
          image={URL.createObjectURL(video)}
        />
      )}
    </Box>
  );
};

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
      <SingleVideoUpload video={video} setVideo={setVideo} />
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
