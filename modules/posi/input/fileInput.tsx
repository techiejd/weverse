import {
  Box,
  Typography,
  Input,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import { Dispatch, SetStateAction, useState, ChangeEvent } from "react";
import { useAppState } from "../../../common/context/appState";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  UploadTask,
  deleteObject,
} from "firebase/storage";
import { v4 } from "uuid";

/** TODO(techiejd): Log errors and state in our servers */

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
  metadata = {},
}: {
  required?: boolean;
  setFileUrl: Dispatch<SetStateAction<string | undefined | "loading">>;
  minFileSize?: number;
  maxFileSize?: number;
  accept: "video" | "img";
  metadata?: Record<string, string>;
}) => {
  const appState = useAppState();

  const [uploadTask, setUploadTask] = useState<UploadTask | undefined>();
  const [file, setFile] = useState<File | undefined | "loading">();
  const [error, setError] = useState("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError("");
    if (file != undefined) {
      if (uploadTask) {
        switch (uploadTask.snapshot.state) {
          case "success":
            deleteObject(uploadTask.snapshot.ref);
            break;
          default:
            uploadTask.cancel();
        }
      }
      setFile(undefined);
    }
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];

      if (
        (minFileSize && f.size < minFileSize) ||
        (maxFileSize && f.size > maxFileSize)
      ) {
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
        return;
      }

      const uploadFileAndSetFileUrl = async () => {
        if (appState) {
          const fileRef = ref(appState.storage, v4());
          const newUploadTask = uploadBytesResumable(fileRef, f, {
            customMetadata: metadata,
          });
          setUploadTask(newUploadTask);
          newUploadTask.on("state_changed", {
            complete: () => {
              (async () => {
                setFileUrl(await getDownloadURL(newUploadTask.snapshot.ref));
                setFile(f);
              })();
            },
          });
        }
      };
      setFile("loading");
      uploadFileAndSetFileUrl();
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
      {file != undefined &&
        (file == "loading" ? (
          <CircularProgress />
        ) : (
          <CardMedia
            sx={{
              height: 200,
              width: 200,
            }}
            component={accept}
            image={URL.createObjectURL(file as File)}
          />
        ))}
    </Box>
  );
};

export default FileInput;
