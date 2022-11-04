import React, { ChangeEvent, useState, useEffect } from "react";
import { ButtonInfo } from "../../../facebook/conversation/utils";

const ButtonInput: React.FC<{
  id: number;
  buttonInfos: Array<ButtonInfo>;
  setButtonInfos: React.Dispatch<React.SetStateAction<Array<ButtonInfo>>>;
}> = (props) => {
  const [title, setTitle] = useState<string>("");
  const [target, setTarget] = useState<"Url" | "Payload" | "Route">("Url");
  const [route, setRoute] = useState<string>("");

  const getUrlRadio = () =>
    document.getElementById(`url${props.id}`) as HTMLInputElement;
  const getPayloadRadio = () =>
    document.getElementById(`payload${props.id}`) as HTMLInputElement;
  const getRouteRadio = () =>
    document.getElementById(`route${props.id}`) as HTMLInputElement;

  useEffect(() => {
    buttonInfoUpdated();
  }, [title, target, route]);

  useEffect(() => {
    getUrlRadio().checked = true;
  }, []);

  const urlRadioClicked = (event: ChangeEvent<HTMLInputElement>) => {
    getPayloadRadio().checked = false;
    getRouteRadio().checked = false;
    setTarget("Url");
  };
  const payloadRadioClicked = (event: ChangeEvent<HTMLInputElement>) => {
    getUrlRadio().checked = false;
    getRouteRadio().checked = false;
    setTarget("Payload");
  };
  const routeRadioClicked = (event: ChangeEvent<HTMLInputElement>) => {
    getUrlRadio().checked = false;
    getPayloadRadio().checked = false;
    setTarget("Payload");
  };

  const buttonInfoUpdated = () => {
    props.buttonInfos[props.id] =
      target == "Url"
        ? {
            title: title,
            url: route,
          }
        : {
            title: title,
            payload: route,
          };
    props.setButtonInfos([...props.buttonInfos]);
  };

  return (
    <div>
      <label htmlFor={`url${props.id}`}>URL</label>
      <input type="radio" id={`url${props.id}`} onChange={urlRadioClicked} />
      <label htmlFor={`payload${props.id}`}>Payload</label>
      <input
        type="radio"
        id={`payload${props.id}`}
        onChange={payloadRadioClicked}
      />
      <label htmlFor={`route${props.id}`}>Route</label>
      <input
        type="radio"
        id={`route${props.id}`}
        onChange={routeRadioClicked}
      />
      <br />
      <br />
      <label htmlFor="title">Title: </label>
      <input
        type="text"
        placeholder="Title"
        id="title"
        name="title"
        onChange={(event) => setTitle(event.target.value)}
      />
      <br />
      <br />
      <label htmlFor="target">{target}: </label>
      <input
        type="text"
        placeholder={target}
        id="target"
        name="title"
        onChange={(event) => setRoute(event.target.value)}
      />
    </div>
  );
};

export default ButtonInput;
