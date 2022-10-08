import type { NextPage } from "next";
import Image from "next/image";
import styles from "../../styles/Home.module.css";
import { useForm } from "react-hook-form";
import { useState, ChangeEvent } from "react";
import { useRouter } from "next/router";
import { Card, CardHeader, CardMedia } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const OnboardingForm: NextPage = () => {
  const [selectedFiles, setSelectedFiles] = useState<
    Array<{ url: string; file: File }>
  >([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [createObjectURL, setCreateObjectURL] = useState<string | null>(null);

  const selectFiles = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }
    const newFiles = Array<{ url: string; file: File }>();
    for (let i = 0; i < event.target.files.length; i++) {
      const file = event.target.files.item(i) as File;
      newFiles.push({ url: URL.createObjectURL(file), file: file });
    }
    setSelectedFiles(selectedFiles.concat(newFiles));
  };

  const router = useRouter();
  const onSubmit = async (data: any) => {
    console.log("In onSubmit!");
    console.log(data);
    const body = ((): FormData => {
      const body = new FormData();
      body.append("lie", data.lie);
      body.append("truth1", data.truth1);
      body.append("truth2", data.truth2);
      console.log(data.truth1Proofs);
      for (let i = 0; i < data.truth1Proofs.length; i++) {
        console.log(data.truth1Proofs[i]);
        body.append("truth1Proofs", data.truth1Proofs[i]);
      }
      return body;
    })();
    const response = await fetch("/api/onboarding", {
      method: "POST",
      body: body,
    });
    console.log("body:", body.keys());
    // router.push("/onboarding/success");
    return true;
  };
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Bienvenido al WeVerse</h1>

        <p className={styles.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>

        <div>
          <form action="/api/onboarding" onSubmit={handleSubmit(onSubmit)}>
            <h2>👺:</h2>
            <textarea
              placeholder="Escribe tu mentira..."
              className={styles.textInput}
              {...register("lie", {
                required: "Se require que digas una mentira.",
              })}
            />
            <br />
            <br />
            <hr />
            <h2>📷:</h2>
            <textarea
              placeholder="Escribe tu primera verdad..."
              className={styles.textInput}
              {...register("truth1", { required: "*" })}
            />
            <h3>Selecciona las validaciones de tu verdad 🌟</h3>
            <label htmlFor="file-upload" className={styles.labelInput}>
              Elegir todos las pruebas (imagenes o video) de tu verdad.
            </label>
            <input
              className={styles.hiddenInput}
              id="file-upload"
              placeholder="Elegir todos las pruebas (imagenes o video) de tu verdad"
              type="file"
              multiple
              {...register("truth1Proofs", {
                required: "*",
                onChange: selectFiles,
              })}
            />
            {selectedFiles.map((fileInfo, i) => (
              <Card key={i}>
                <CardHeader
                  action={
                    <IconButton aria-label="close">
                      <CloseIcon />
                    </IconButton>
                  }
                  title={fileInfo.file.name}
                />
                <CardMedia
                  component="img"
                  sx={{}}
                  image={fileInfo.url}
                  alt={`file-${i}`}
                />
              </Card>
            ))}
            {/* <ul>
              {selectedFiles.map((fileInfo, i) => (
                <li key={`name-${i}`}>
                  <p>{fileInfo.file.name}</p>
                  <Image src={fileInfo.url} alt="yoyo" layout="fill" />
                </li>
              ))}
            </ul> */}
            <br />
            <br />
            <hr />
            <h2>📷:</h2>
            <textarea
              placeholder="Escribe tu segunda verdad..."
              className={styles.textInput}
              {...register("truth2", { required: "*" })}
            />
            <br />
            <br />
            <hr />
            <button type="submit" className={styles.button}>
              Terminar
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default OnboardingForm;
