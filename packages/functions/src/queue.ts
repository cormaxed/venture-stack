import { SQSEvent } from "aws-lambda";
import { getAuth0User } from "./auth0-client";
import { db } from "@venture-stack/core/db";

const syncUser = async (id: string) => {
  const user = await getAuth0User(id);

  console.log(`Updating user: ${id} with auth0 data`);
  await db
    .updateTable("udoit.user")
    .set({
      last_ip: user.last_ip,
      last_login: new Date(user.last_login),
      logins_count: user.logins_count,
    })
    .where("id", "=", id)
    .execute();
};

export async function handle(event: SQSEvent) {
  console.log("Consuming queue");
  const records: any[] = event.Records;

  console.log(`Message processed: "${records[0].body}"`);
  const { id } = JSON.parse(records[0].body);
  if (id.startsWith("auth0|")) {
    await syncUser(id);
  }

  return {};
}
