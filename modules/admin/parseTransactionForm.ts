import type { NextApiRequest } from "next";
import formidable from "formidable";
import IncomingForm from "formidable/Formidable";
import {
  ButtonInfo,
  buttonInfo,
  MessageType,
  messageType,
} from "../facebook/conversation/utils";
import { ChangesInResources, changesInResources } from "../db/schemas";

const parseForm = async (req: NextApiRequest, f: IncomingForm) =>
  await new Promise<[formidable.Fields, formidable.Files]>(
    (resolve, reject) => {
      f.parse(req, (e, fields, files) =>
        e ? reject(e) : resolve([fields, files])
      );
    }
  );

export const parseTransactionForm = async (
  req: NextApiRequest
): Promise<{
  message: string;
  buttons: Array<ButtonInfo>;
  messageType: MessageType;
  resourcesChange: ChangesInResources;
  usersOfInterest: Array<string> | undefined;
  route: string | undefined;
}> => {
  const form = new formidable.IncomingForm({ multiples: true });
  const [fields, files] = await parseForm(req, form);
  const nonStringButtons = JSON.parse(String(fields["buttons"]));
  const nonStringResourcesChange = JSON.parse(
    String(fields["resourcesChange"])
  );

  return {
    message: String(fields["message"]),
    buttons: buttonInfo.array().parse(nonStringButtons),
    messageType: messageType.parse(fields["messageType"]),
    resourcesChange: changesInResources.parse(nonStringResourcesChange),
    usersOfInterest: fields["users"]
      ? JSON.parse(String(fields["users"]))
      : undefined,
    route: fields["route"] ? String(fields["route"]) : undefined,
  };
};
