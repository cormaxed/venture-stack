import AWS from "aws-sdk";
import { Queue } from "sst/node/queue";
import { db } from "@venture-stack/core/src/db";

const sqs = new AWS.SQS();

const sendMessage = async (message: string) => {
  return new Promise((resolve, reject) => {
    sqs.sendMessage(
      {
        // Get the queue url from the environment variable
        QueueUrl: Queue.Queue.queueUrl,
        MessageBody: message,
      },
      function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data.MessageId);
        }
      }
    );
  });
};

export async function userSyncJob() {
  const users = await db
    .selectFrom("udoit.user")
    .selectAll("udoit.user")
    .execute();

  await Promise.all(
    users.map(async (user) => {
      await sendMessage(JSON.stringify({ id: user.id, email: user.email }));
    })
  );
}
