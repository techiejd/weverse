import { Dispatch, FC, SetStateAction } from "react";
import { ChangesInResources, UserData } from "../../../db/schemas";
import { ButtonInfo } from "../../../facebook/conversation/utils";
import { Assign } from "./assignResources";
import { CreateMessage } from "./createMessage";

// TODO(jimenez1917): Use context to make easier.
export const UserManagerPortal: FC<{
  userForTemplating: UserData;
  resourcesChange: ChangesInResources;
  setResourcesChange: Dispatch<SetStateAction<ChangesInResources>>;
  target: "Notify" | "Response";
  setTarget: Dispatch<SetStateAction<"Notify" | "Response">>;
  inputMessage: string;
  setInputMessage: Dispatch<SetStateAction<string>>;
  buttonInfos: Array<ButtonInfo>;
  setButtonInfos: Dispatch<SetStateAction<Array<ButtonInfo>>>;
}> = (props) => {
  return (
    <>
      <Assign
        resourcesChange={props.resourcesChange}
        setResourcesChange={props.setResourcesChange}
      />
      <CreateMessage
        userForTemplating={props.userForTemplating}
        target={props.target}
        setTarget={props.setTarget}
        inputMessage={props.inputMessage}
        setInputMessage={props.setInputMessage}
        buttonInfos={props.buttonInfos}
        setButtonInfos={props.setButtonInfos}
      />
    </>
  );
};
