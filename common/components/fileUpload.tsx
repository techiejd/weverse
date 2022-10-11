import styles from "../../styles/Home.module.css";
import { useForm } from "react-hook-form";
import { ChangeEvent, MouseEvent } from "react";
import { Card, CardHeader, CardMedia, Container } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";


const FileUploader = (props: {selectedFiles: {
    url: string;
    file: File;
}[],
setSelectedFiles: React.Dispatch<React.SetStateAction<{
    url: string;
    file: File;
}[]>>, message: string}) => {

  const {
    register,
    formState: { errors },
  } = useForm();

  const selectFiles = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }
    const newFiles = Array<{ url: string; file: File }>();
    for (let i = 0; i < event.target.files.length; i++) {
      const file = event.target.files.item(i) as File;
      newFiles.push({ url: URL.createObjectURL(file), file: file });
    }
    props.setSelectedFiles(props.selectedFiles.concat(newFiles));
  };
  const closeCardFor = (i: number) => (e: MouseEvent) => {
    props.selectedFiles.splice(i, 1);
    // Must be spread out to re-render
    // See https://stackoverflow.com/questions/56266575/why-is-usestate-not-triggering-re-render
    props.setSelectedFiles([...props.selectedFiles]);
  };

  return (
    <div className={styles.container}>
            <label htmlFor="file-upload" className={styles.labelInput}>
              {props.message}
            </label>
            <input
              className={styles.hiddenInput}
              id="file-upload"
              placeholder={props.message}
              type="file"
              multiple
              {...register("truth1Proofs", {
                required: "*",
                onChange: selectFiles,
              })}
            />
            <Container
              sx={{
                display: "flex",
              }}
              id="uploadedFiles"
            >
              {props.selectedFiles.map((fileInfo, i) => (
                <Card
                  sx={{
                    height: 200,
                    width: 200,
                  }}
                  key={i}
                >
                  <CardHeader
                    action={
                      <IconButton
                        aria-label="close"
                        onClick={closeCardFor(i)}
                        key={i}
                      >
                        <CloseIcon />
                      </IconButton>
                    }
                    title={fileInfo.file.name}
                    titleTypographyProps={{ variant: "body2" }}
                  />
                  <CardMedia
                    component="img"
                    image={fileInfo.url}
                    alt={`file-${i}`}
                  />
                </Card>
              ))}
            </Container>
    </div>
  );
};

export default FileUploader;

