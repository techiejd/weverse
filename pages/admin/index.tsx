import type { NextPage } from "next";
import styles from "../../styles/Home.module.css";
import { useForm } from "react-hook-form";
import { useState, MouseEvent, Component } from "react";
import { useRouter } from "next/router";
import FileUploader from '../../common/components/fileUpload'
import { getUserSnapshot } from "../../common/db";
import { userData, UserData } from "../../modules/db/schemas";
import * as utils from "../../modules/facebook/messenger/utils";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Tooltip from '@mui/material/Tooltip';
import React, { FC } from 'react';
import {ButtonInput} from './buttonInput'

export async function getServerSideProps() {
  return getUserSnapshot(String(process.env.ADMIN_ID)).then(
    async (userSnapshot) => {
      return {
        props: {
          admin: userData.parse(userSnapshot.data()) 
        },
      };
    });
}

const dashboard: NextPage<{admin: UserData}> = (
  props) => {
  const [templatedMessage,setTemplatedMessage] = useState<string>('')
  const [inputMessage,setInputMessage] = useState<string>('')
  const [selectedFiles, setSelectedFiles] = useState<Array<{url: string, file: File}>>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const onSubmit = async (data: any) => {
    console.log(data)
    const body = ((): FormData => {
      const body = new FormData();
      body.append("message",data.message);
      for (let i = 0; i < selectedFiles.length; i++) {
        body.append("messageFiles", selectedFiles[i].file);
      }
      return body;
    })();
    const response = fetch("/api/admin", {
      method: "POST",
      body: body,
    });
    console.log("I{m in here");
    router.push("/admin/success");
    return true;
  };
  const processInput = (e: MouseEvent)=>{
    e.preventDefault();
    const templated = utils.Notify.templateBody(inputMessage,props.admin);
    setTemplatedMessage(templated);
  }

  const [buttonInputs, setButtonInputs] = useState<Array<() => JSX.Element>>([]);

  const incNumButtonInputs = (e:MouseEvent) => {
    e.preventDefault();
    if(buttonInputs.length >= 3){
      alert("max limit reached")
    }else{
      setButtonInputs([...buttonInputs,ButtonInput]);
    }
  };

  const decNumButtonInputs = (e:MouseEvent) => {
    e.preventDefault();
    if (buttonInputs.length > 0) {
      buttonInputs.pop();
      setButtonInputs([...buttonInputs, ButtonInput])
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Actuar como Sofí : {props.admin.name}</h1>
       <div>
          <form action="/api/onboarding" onSubmit={handleSubmit(onSubmit)}>
            <h2>Message:</h2>
            <textarea
              placeholder="Escribe el mensaje..."
              className={styles.textInput}
              {...register("message", {
                required: "*",
                onChange: (e)=>setInputMessage(e.target.value)
              })}
            />
            <br/>
            <br/>
               <FileUploader selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} message="Activa tus publicaciones"/>
            <br/>
            <br/>
              <button  onClick={decNumButtonInputs} >
                  <RemoveIcon color="action"/>
                </button>
              <h1>Up to 3 buttons allowed</h1>
              <button onClick={incNumButtonInputs}>
                <AddIcon color="action" />
              </button>
              <br/>
              <br/>
            {buttonInputs.map((buttonInput) =>(
              <ButtonInput/>
            ))}
            <button onClick={processInput}>
              Check
            </button>
            {templatedMessage?(<>
                {templatedMessage}
            </>):(<></>)}
            <br/>
            <hr/>
            <button type="submit" className={styles.button}>
              Enviar
            </button>

          </form>
        </div>
      </main>
    </div>
  );
};

export default dashboard;
