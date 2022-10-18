import { FC } from "react";
import { UserData } from "../../../db/schemas";
import { Assign } from "./assignResources";
import { CreateMessage } from "./createMessage";

export const UserManagerPortal: FC<{ userForTemplating: UserData }> = (
  props
) => {
  return (
    <>
      <Assign />
      <CreateMessage userForTemplating={props.userForTemplating} />
    </>
  );
};
