import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface UdoitProject {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  type: string | null;
  subtype: string | null;
  user_id: string;
  parent_id: string | null;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
}

export interface UdoitTask {
  id: string;
  name: string;
  description: string | null;
  deadline: Timestamp | null;
  priority: number | null;
  done: boolean | null;
  archived: boolean | null;
  project_id: string;
  user_id: string;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
}

export interface UdoitUser {
  id: string;
  email: string;
  firstname: string | null;
  lastname: string | null;
  password: string | null;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
  last_ip: string | null;
  last_login: Timestamp | null;
  logins_count: number | null;
}

export interface Database {
  "udoit.project": UdoitProject;
  "udoit.task": UdoitTask;
  "udoit.user": UdoitUser;
}
