import { db, getInsertRowDefaults } from "../lib/db";
import { User, UserSearch } from "../types/types";

export const getUser = async (query: UserSearch): Promise<User> => {
  let qb = db.selectFrom("udoit.user").selectAll("udoit.user");

  if (query.id) {
    qb = qb.where("id", "=", query.id);
  } else if (query.email) {
    qb = qb.where("email", "=", query.email);
  } else {
    throw new Error("Invalid query: {id | email} is required");
  }

  const user = (await qb.executeTakeFirst()) as User;

  return user;
};

export const createUser = async (data: {
  email: string;
  password: string;
}): Promise<{ id: string; email: string }> => {
  const insertDefaults = getInsertRowDefaults();
  await db
    .insertInto("udoit.user")
    .values({ ...insertDefaults, ...data })
    .executeTakeFirstOrThrow();

  return { id: insertDefaults.id, email: data.email };
};

export const createExternalUser = async (data: {
  email: string;
  id: string;
}): Promise<{ id: string; email: string }> => {
  const insertDefaults = getInsertRowDefaults(data.id);
  await db
    .insertInto("udoit.user")
    .values({ ...insertDefaults, ...data })
    .executeTakeFirstOrThrow();

  return { id: insertDefaults.id, email: data.email };
};
