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
    return <input></input>;
  },
});
const Upload = () => {
  return (
    <div style={{ width: "100%", height: "90vh" }}>
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
              name: "location",
              id: "posi-upload-location",
              attributes: {
                label: "OMG ME",
                description: "Take two.",
              },
            },
            {
              name: "video",
              id: "posi-upload-video",
            },
            {
              name: "short-text",
              id: "kd12edg",
              attributes: {
                classnames: "first-block",
                required: true,
                label: "Let's start with your name",
              },
            },
            {
              name: "multiple-choice",
              id: "gqr1294c",
              attributes: {
                required: true,
                multiple: true,
                verticalAlign: false,
                label: "Which subjects do you love the most?",
                choices: [
                  {
                    label: "Physics",
                    value: "physics",
                  },
                  {
                    label: "Math",
                    value: "math",
                  },
                  {
                    label: "English",
                    value: "english",
                  },
                  {
                    label: "Biology",
                    value: "biology",
                  },
                ],
              },
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
