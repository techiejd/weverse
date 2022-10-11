import type { NextPage } from "next";
import styles from "../../styles/Home.module.css";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/router";
import FileUploader from '../components/fileUploader'

const OnboardingForm: NextPage = () => {
  const [selectedFiles, setSelectedFiles] = useState<Array<{url: string, file: File}>>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const onSubmit = async (data: any) => {
    const body = ((): FormData => {
      const body = new FormData();
      for (let i = 0; i < selectedFiles.length; i++) {
        body.append("truth1Proofs", selectedFiles[i].file);
      }
      return body;
    })();
    const response = await fetch("/api/onboarding", {
      method: "POST",
      body: body,
    });
    router.push("/onboarding/success");
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
              <FileUploader selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles}/>
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
