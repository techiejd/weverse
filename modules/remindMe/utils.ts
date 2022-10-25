import { Messenger } from "../facebook/schemas";
import * as tasks from '@google-cloud/tasks';
import {logger} from '../../common/logger';

export const setReminder = async function (
  psid: string,
  message: Messenger.Message,
  inHowManySeconds: number,
) {
  const client = new tasks.CloudTasksClient();
  const parent = client.queuePath(String(process.env.GCP_NAME), String(process.env.GCP_LOCATION), "remindMe");

  const when = (Date.now() / 1000) + inHowManySeconds;

  const convertedPayload = JSON.stringify({psid, message});
  const body = Buffer.from(convertedPayload).toString('base64');

  const url = "https://onewe.tech/api/remindMe"
  const task = {
    httpRequest: {
      httpMethod: 'POST' as 'POST',
      url,
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    },
    scheduleTime : {
      seconds: when,
    }
  };

  try {
    // Send create task request.
    const [response] = await client.createTask({parent, task});
    logger.info(`Created task ${response.name}`);
    return;
  } catch (error) {
    logger.error(error, "Error in creating task");
  }
};