import "@quillforms/renderer-core/build-style/style.css";
import { Form } from "@quillforms/renderer-core";
import { useEffect, useState } from "react";
const reactRenderUtils = require("@quillforms/react-renderer-utils");
import { registerBlockType } from "@quillforms/blocks";
import { CitySearchInput, FileInput } from "../../modules/posi/input";

reactRenderUtils.registerCoreBlocks();

/**{
    id: string;
    next: () => void;
    attributes: Object;
    setIsValid: (boolean) => void;
    setIsAnswered: (boolean) => void;
    setValidationErr: (string) => void;
    showNextBtn: (boolean) => void;
    blockWithError: (string) => void;
    val: any;
    setVal: (any) => void;
    showErrMsg: (boolean) => void;
  }
  
  <FileInput
        required
        minFileSize={1048576 /** 1MB }
        maxFileSize={2147483648 /** 2GB }
        accept={"video"}
        metadata={{ impactId: "" }}
      />
      
      */

registerBlockType("location", {
  supports: { editable: true },
  display: ({
    id,
    next,
    attributes,
    setIsValid,
    setIsAnswered,
    setValidationErr,
    showNextBtn,
    blockWithError,
    val,
    setVal,
    showErrMsg,
  }: any) => {
    return <CitySearchInput />;
  },
});

registerBlockType("video", {
  supports: { editable: true },
  display: () => {
    return <input />;
  },
});
const Upload = () => {
  return (
    <div style={{ width: "100%", height: "91vh" }}>
      <Form
        isPreview={false}
        applyLogic={false}
        formId={1}
        formObj={{
          hiddenFields: {},
          blocks: [
            {
              name: "welcome-screen",
              id: "posi-upload-welcome-screen",
              attributes: {
                label: "Welcome to our survey",
                description: "This is just a description",
                attachment: {
                  type: "image",
                  url: "/JD.jpeg",
                },
                attachmentMaxWidth: "300px",
              },
            },
            {
              id: "posi-upload-about",
              name: "group",
              attributes: {
                label: "¡Cuentenos sobre tu acción social!",
              },
              innerBlocks: [
                {
                  id: "posi-upload-about-title",
                  name: "short-text",
                  attributes: {
                    label:
                      "Cuéntanos sobre tu acción social como título de una película",
                    required: false,
                    placeholder: "Título (100 caracteres)",
                    setMaxCharacters: true,
                    maxCharacters: 100,
                  },
                },
                {
                  id: "posi-upload-about-video",
                  name: "video",
                  attributes: {
                    label:
                      "Muéstranos un poco de lo que has hecho: luces, CAMARA, ACCION",
                    required: false,
                  },
                },
              ],
            },
            {
              id: "posi-upload-about-story",
              name: "long-text",
              attributes: {
                label: "Cuenta tu historia",
                required: false,
                placeholder:
                  "Historia (1000 Caracteres)\n\n\n\n\n\n\n\n\n\n\n ",
              },
            },
            {
              id: "posi-upload-impacted-people",
              name: "group",
              attributes: {
                label: "Hablemos sobre la población impactada",
              },
              innerBlocks: [
                {
                  id: "posi-upload-impacted-people-identify",
                  name: "short-text",
                  attributes: {
                    label:
                      "En una frase, ¿cómo podrías definir la población a la que ayudaste?",
                    required: false,
                    placeholder: "Población (125 caracteres)",
                  },
                },
                {
                  id: "posi-upload-impacted-people-number",
                  name: "number",
                  attributes: {
                    label: "Cuántas personas fueron impactadas con tu proyecto",
                    required: false,
                    placeholder: "00000",
                  },
                },
                {
                  id: "posi-upload-impacted-people-location",
                  name: "location",
                  attributes: {
                    label: "Dónde realizaste este proyecto",
                    required: false,
                  },
                },
              ],
            },
            {
              id: "posi-upload-support",
              name: "group",
              attributes: {
                label: "¿Qué tipo de apoyo necesitas?",
              },
              innerBlocks: [
                {
                  id: "posi-upload-support-financial",
                  name: "long-text",
                  attributes: {
                    label: "Apoyo financiero:",
                    required: false,
                    placeholder:
                      "Deja aquí el enlace o los datos de tus cuentas para recibir donaciones: (500 caracteres)",
                  },
                },
                {
                  id: "posi-upload-support-other",
                  name: "long-text",
                  attributes: {
                    label: "Otro tipo de apoyo",
                    required: false,
                    placeholder:
                      "Deja aquí los datos de contacto para recibir ayudas de cualquier otro tipo. (500 caracteres.)",
                  },
                },
              ],
            },
          ],
        }}
        onSubmit={(
          data,
          { completeForm, setIsSubmitting, goToBlock, setSubmissionErr }
        ) => {
          setTimeout(() => {
            setIsSubmitting(false);
            completeForm();
          }, 500);
        }}
      />
    </div>
  );
};

export default Upload;
