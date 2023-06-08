import {
  UdoitUser as DbUser,
  UdoitProject as DbProject,
  UdoitTask as DbTask,
} from "@venture-stack/core/src/kysely-types";

export type EntityId = {
  id: string;
};

export type UserIdEmail = {
  id: DbUser["id"];
  email: DbUser["email"];
};

export type UserSearch = {
  id?: string;
  email?: string;
};

export type User = UserIdEmail & {
  firstname: DbUser["firstname"];
  lastname: DbUser["lastname"];
  password?: DbUser["password"];
  created_at: Date;
  updated_at?: Date;
};

export type Project = {
  id: DbProject["id"];
  name: DbProject["name"];
  type: DbProject["type"];
  subtype: DbProject["subtype"];
  description?: DbProject["description"];
  icon: DbProject["icon"];
  color: DbProject["color"];
  user_id: DbProject["user_id"];
  parent_id: DbProject["parent_id"];
  created_at: Date;
  updated_at?: Date;
};

export type Task = {
  id: DbTask["id"];
  name: DbTask["name"];
  description: DbTask["description"];
  priority: DbTask["priority"];
  deadline: Date;
  done: DbTask["done"];
  project_id: DbTask["project_id"];
  user_id: DbTask["user_id"];
  created_at: Date;
  updated_at?: Date;
  project_name: string;
};

export type Token = {
  accessToken: string;
  refreshToken?: string;
};

export type ProjectType = "user" | "system" | "favourites";

export type Profile = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  defaultProject: Project;
};

export type Projects = {
  system: Array<Project>;
  user: Array<Project>;
  favourites: Array<Project>;
};

export type Healthz = {
  time: string;
};

export type Error = {
  error: string;
};
