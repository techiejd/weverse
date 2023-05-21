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
import { Media } from "../../../functions/shared/src";

/** TODO(techiejd): Log errors and state in our servers */

function humanFileSize(size: number) {
  var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return (
    (size / Math.pow(1024, i)).toFixed(2) +
    " " +
    ["B", "kB", "MB", "GB", "TB"][i]
  );
}

const getFileType = (f: File) => {
  return f.name.endsWith("mp4") ||
    f.name.endsWith("MP4") ||
    f.name.endsWith("mov") ||
    f.name.endsWith("MOV") ||
    f.name.endsWith("qt") ||
    f.name.endsWith("QT")
    ? "video"
    : "img";
};

// Only supports single file atm
const FileInput = ({
  required = false,
  initialMedia,
  setMedia,
  maxFileSize,
  accept,
  metadata = {},
}: {
  required?: boolean;
  initialMedia?: Media;
  setMedia: Dispatch<SetStateAction<Media | undefined | "loading">>;
  maxFileSize?: number;
  accept: "video" | "img" | "both";
  metadata?: Record<string, string>;
}) => {
  const appState = useAppState();
  const [useInitialFileUrl, setUseInitialFileUrl] = useState(true);

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

      if (maxFileSize && f.size > maxFileSize) {
        setFile(undefined);
        setMedia(undefined);
        e.target.value = "";
        setError(
          `File is too large. Must be smaller than ${humanFileSize(
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
                setMedia({
                  type: getFileType(f),
                  url: await getDownloadURL(newUploadTask.snapshot.ref),
                });
                setFile(f);
              })();
            },
          });
        }
      };
      setFile("loading");
      setMedia("loading");
      uploadFileAndSetFileUrl();
    }
  };

  return (
    <Box>
      {error != "" && (
        <Typography sx={{ color: "red" }}>Error: {error}</Typography>
      )}
      {useInitialFileUrl && initialMedia && (
        <CardMedia
          sx={{
            height: 200,
            width: 200,
          }}
          component={initialMedia!.type!}
          image={initialMedia.url}
        />
      )}
      {file != undefined &&
        (file == "loading" ? (
          <CircularProgress />
        ) : (
          <CardMedia
            sx={{
              height: 200,
              width: 200,
            }}
            component={getFileType(file as File)}
            image={URL.createObjectURL(file as File)}
          />
        ))}
      <Input
        type="file"
        onChange={handleFileChange}
        slotProps={{
          input: {
            accept:
              accept == "both"
                ? "video/mp4, video/quicktime, image/jpeg, image/jpg, image/png"
                : accept == "video"
                ? "video/mp4, video/quicktime,"
                : "image/jpeg, image/jpg, image/png",
          },
        }}
        onClick={() => setUseInitialFileUrl(false)}
        error={error != ""}
        required={required}
      />
    </Box>
  );
};

export default FileInput;
