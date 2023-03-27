import { Box, Typography, Input, CardMedia } from "@mui/material";
import {
  Dispatch,
  SetStateAction,
  useState,
  ChangeEvent,
  useEffect,
  useReducer,
} from "react";
import { useAppState } from "../../../common/context/appState";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

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
  required = false,
  setFileUrl,
  minFileSize,
  maxFileSize,
  accept,
}: {
  required?: boolean;
  setFileUrl: Dispatch<SetStateAction<string | undefined | "loading">>;
  minFileSize?: number;
  maxFileSize?: number;
  accept: "video" | "img";
}) => {
  const appState = useAppState();

  const [file, setFile] = useState<File | undefined>();
  const [error, setError] = useState("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError("");
    console.log("Ayo1");
    if (e.target.files) {
      if (file) {
        // TODO(techiejd): what's the best experience here?
        // Is it just return? or should we delete the one prior?
        return;
      }
      console.log("Ayo2");

      const f = e.target.files[0];

      if (
        (minFileSize && f.size < minFileSize) ||
        (maxFileSize && f.size > maxFileSize)
      ) {
        console.log("Ayo3");
        //TODO(techiejd): Same thing here. Is this really best?
        setFile(undefined);
        setFileUrl(undefined);
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

      console.log("Ayo4");

      const uploadFileAndSetFileUrl = async () => {
        console.log("Ayo5");
        if (appState) {
          console.log("Ayo6");
          const fileRef = ref(appState.storage, v4());
          console.log("FileRef: ", fileRef);
          uploadBytes(fileRef, f)
            .then((uploadResult) => {
              getDownloadURL(uploadResult.ref)
                .then((fileUrl) => {
                  console.log("All good chief");
                  console.log(fileUrl);
                  setFileUrl(fileUrl);
                })
                .catch((error) => {
                  console.log("Error in getDownloadURL");
                  console.log(error);
                });
            })
            .catch((error) => {
              console.log("error in uploadBytes");
              console.log(error);
            });
        }
      };
      uploadFileAndSetFileUrl();

      setFile(f);
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
        error={error != ""}
        required={required}
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
