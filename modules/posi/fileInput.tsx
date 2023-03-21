import { Box, Typography, Input, CardMedia } from "@mui/material";
import { Dispatch, SetStateAction, useState, ChangeEvent } from "react";

function humanFileSize(size: number) {
  var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return (
    (size / Math.pow(1024, i)).toFixed(2) +
    " " +
    ["B", "kB", "MB", "GB", "TB"][i]
  );
}

// Only supports single file atm
const FileInput = ({
  file,
  setFile,
  minFileSize,
  maxFileSize,
  accept,
}: {
  file: File | undefined;
  setFile: Dispatch<SetStateAction<File | undefined>>;
  minFileSize?: number;
  maxFileSize?: number;
  accept: "video" | "img";
}) => {
  const [error, setError] = useState("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError("");
    if (e.target.files) {
      const fileSelectionWasCanceled = e.target.files.length == 0;
      if (fileSelectionWasCanceled && file) {
        setFile(undefined);
        return;
      }

      const f = e.target.files[0];

      if (
        (minFileSize && f.size < minFileSize) ||
        (maxFileSize && f.size > maxFileSize)
      ) {
        setFile(undefined);
        e.target.value = "";
        setError(
          minFileSize && f.size < minFileSize
            ? `File is too small. Must be greater than ${humanFileSize(
                minFileSize
              )}.`
            : `File is too large. Must be smaller than ${humanFileSize(
                maxFileSize ? maxFileSize : 0
              )}.`
        );
      }

      setFile(e.target.files[0]);
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
        slotProps={{
          input: {
            accept: accept == "video" ? "video/mp4" : "image/jpeg, image/jpg",
          },
        }}
        error
      />
      {file && (
        <CardMedia
          sx={{
            height: 200,
            width: 200,
          }}
          component={accept}
          image={URL.createObjectURL(file)}
        />
      )}
    </Box>
  );
};

export default FileInput;
