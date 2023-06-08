import bcrypt from "bcryptjs";
import { db } from "../lib/db";
import { User, Profile, Project, UserIdEmail } from "../types/types";
import { createExternalUser, createUser } from "./user-ds";
import { createSystemProjects } from "./project-ds";

const getProfile = async (user: User): Promise<Profile> => {
  const profile = await db
    .selectFrom("udoit.user")
    .selectAll("udoit.user")
    .where("id", "=", user.id)
    .executeTakeFirstOrThrow();

  const defaultProject = (await db
    .selectFrom("udoit.project")
    .selectAll("udoit.project")
    .where("user_id", "=", user.id)
    .where("udoit.project.type", "=", "system")
    .where("udoit.project.name", "=", "Inbox")
    .where("udoit.project.user_id", "=", user.id)
    .executeTakeFirstOrThrow()) as Project;

  return {
    id: user.id,
    email: profile.email,
    firstname: profile.firstname,
    lastname: profile.lastname,
    defaultProject,
  };
};

const createProfile = async (
  email: string,
  password: string
): Promise<UserIdEmail> => {
  const salt = bcrypt.genSaltSync();

  const user = await createUser({
    email,
    password: password ? bcrypt.hashSync(password, salt) : null,
  });

  await createSystemProjects(user.id);

  return user;
};

const createExternalProfile = async (
  id: string,
  email: string
): Promise<UserIdEmail> => {
  const user = await createExternalUser({
    id,
    email,
  });

  await createSystemProjects(user.id);

  return user;
};

export { getProfile, createProfile, createExternalProfile };
