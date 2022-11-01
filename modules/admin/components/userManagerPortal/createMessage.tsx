import styles from "../../../../styles/Home.module.css";
import {
  ChangeEvent,
  useEffect,
  useState,
  FC,
  MouseEvent,
  SetStateAction,
  Dispatch,
} from "react";
import { useForm } from "react-hook-form";
import FileUploader from "../../../../common/components/fileUpload";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ButtonInput from "./buttonInput";
import * as utils from "../../../facebook/conversation/utils";
import { ButtonInfo } from "../../../facebook/conversation/utils";
import { UserData } from "../../../db/schemas";

export const CreateMessage: FC<{
  userForTemplating: UserData;
  messageType: utils.MessageType;
  setMessageType: Dispatch<SetStateAction<utils.MessageType>>;
  inputMessage: string;
  setInputMessage: Dispatch<SetStateAction<string>>;
  buttonInfos: Array<ButtonInfo>;
  setButtonInfos: Dispatch<SetStateAction<Array<ButtonInfo>>>;
  route: string;
  setRoute: Dispatch<SetStateAction<string>>;
}> = (props) => {
  const [templatedMessage, setTemplatedMessage] = useState<string>("");
  const [templatedRoute, setTemplatedRoute] = useState<string>("");
  const [templatedButtons, setTemplatedButtons] = useState<Array<ButtonInfo>>(
    []
  );
  const [selectedFiles, setSelectedFiles] = useState<
    Array<{ url: string; file: File }>
  >([]);

  const processInput = (e: MouseEvent) => {
    e.preventDefault();

    const templater = utils.Notify.getTemplaters(props.userForTemplating);
    setTemplatedMessage(templater.templateBody(props.inputMessage));
    setTemplatedRoute(templater.templateRoute(props.route));
    setTemplatedButtons(props.buttonInfos.map(templater.templateButton));
  };

  const incNumButtonInputs = (e: MouseEvent) => {
    e.preventDefault();

    if (props.buttonInfos.length >= 3) {
      alert("max limit reached");
    } else {
      props.setButtonInfos([...props.buttonInfos, { title: "", payload: "" }]);
    }
  };
  const decNumButtonInputs = (e: MouseEvent) => {
    e.preventDefault();
    if (props.buttonInfos.length > 0) {
      props.buttonInfos.pop();
      props.setButtonInfos([...props.buttonInfos]);
    }
  };

  const getNotifyRadio = () =>
    document.getElementById("Notify") as HTMLInputElement;
  const getResponseRadio = () =>
    document.getElementById("Response") as HTMLInputElement;
  useEffect(() => {
    getNotifyRadio().checked = true;
  }, []);

  const notifyRadioClicked = (event: ChangeEvent<HTMLInputElement>) => {
    getResponseRadio().checked = false;
    props.setMessageType("Notify");
  };
  const responseRadioClicked = (event: ChangeEvent<HTMLInputElement>) => {
    getNotifyRadio().checked = false;
    props.setMessageType("Response");
  };
  const { register, handleSubmit } = useForm();

  return (
    <div>
      <hr />
      <label htmlFor="Notify">NOTIFY</label>
      <input type="radio" id="Notify" onChange={notifyRadioClicked} />
      <label htmlFor="Response">RESPONSE</label>
      <input type="radio" id="Response" onChange={responseRadioClicked} />
      <br />
      <h2>Message:</h2>
      <textarea
        placeholder="Escribe el mensaje..."
        className={styles.textInput}
        {...register("message", {
          required: "*",
          onChange: (e) => props.setInputMessage(e.target.value),
        })}
      />
      <br />
      <label htmlFor="route">Route: </label>
      <input
        type="text"
        id="route"
        placeholder="route..."
        onChange={(e) => props.setRoute(e.target.value)}
      />
      <br />
      <br />
      <FileUploader
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        message="Activa tus publicaciones"
      />
      <br />
      <br />
      <button onClick={decNumButtonInputs}>
        <RemoveIcon color="action" />
      </button>
      <h1>Up to 3 buttons allowed</h1>
      <button onClick={incNumButtonInputs}>
        <AddIcon color="action" />
      </button>
      <br />
      <br />
      {props.buttonInfos.map((buttonInfo, i) => (
        <div key={i}>
          <ButtonInput
            id={i}
            buttonInfos={props.buttonInfos}
            setButtonInfos={props.setButtonInfos}
          />
          <br />
          <hr />
        </div>
      ))}
      <button onClick={processInput}>Check</button>
      <br />
      {templatedMessage ? (
        <>
          <h1>Message:</h1> {templatedMessage}
          <br />
          {templatedRoute ? (
            <>
              <h1>Route:</h1> {templatedRoute}
            </>
          ) : (
            <>
              <h1>Route:</h1> No hay ruta especifica, se creara con el ID
            </>
          )}
        </>
      ) : (
        <></>
      )}
      <br />
      {templatedButtons.map((button, i) => (
        <div key={i}>
          <h1>Button {i}:</h1>
          <p>Title: {button.title}</p>
          <p>
            {button.url ? (
              <> url: {button.url}</>
            ) : (
              <> payload: {button.payload}</>
            )}
          </p>
        </div>
      ))}
      <hr />
    </div>
  );
};
