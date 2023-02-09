import { Dispatch, FC, SetStateAction } from "react";
import { ChangesInResources, UserData } from "../../../db/schemas";
import { ButtonInfo, MessageType } from "../../../facebook/conversation/utils";
import { Assign } from "./assignResources";
import { CreateMessage } from "./createMessage";

// TODO(jimenez1917): Use context to make easier.
export const UserManagerPortal: FC<{
  userForTemplating: UserData;
  resourcesChange: ChangesInResources;
  setResourcesChange: Dispatch<SetStateAction<ChangesInResources>>;
  messageType: MessageType;
  setMessageType: Dispatch<SetStateAction<MessageType>>;
  inputMessage: string;
  setInputMessage: Dispatch<SetStateAction<string>>;
  buttonInfos: Array<ButtonInfo>;
  setButtonInfos: Dispatch<SetStateAction<Array<ButtonInfo>>>;
  route?: string;
  setRoute?: Dispatch<SetStateAction<string>>;
}> = (props) => {
  return (
    <>
      <Assign
        resourcesChange={props.resourcesChange}
        setResourcesChange={props.setResourcesChange}
      />
      <CreateMessage
        userForTemplating={props.userForTemplating}
        messageType={props.messageType}
        setMessageType={props.setMessageType}
        inputMessage={props.inputMessage}
        setInputMessage={props.setInputMessage}
        buttonInfos={props.buttonInfos}
        setButtonInfos={props.setButtonInfos}
        route={props.route}
        setRoute={props.setRoute}
      />
    </>
  );
};
