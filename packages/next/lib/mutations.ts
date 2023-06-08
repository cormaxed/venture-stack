import { Token } from "../types/types";
import { fetcher } from "./fetcher";

export const auth = (
  mode: "signin" | "signup",
  body: { email: string; password: string }
): Promise<Token> => {
  return fetcher(`/${mode}`, body);
};

export const createProject = (data: {
  name: string;
  parentId: string;
  color: string;
}) => {
  return fetcher("/project", data);
};

export const createTask = (data: {
  name: string;
  description: string;
  priority: number;
  deadline: Date;
  projectId: string;
}) => {
  return fetcher("/task", data);
};

export const updateTask = (data: {
  taskId: string;
  name: string;
  description: string;
  priority: number;
  deadline: Date;
  projectId: string;
}) => {
  return fetcher("/task", { action: "update", ...data }, "PUT");
};

export const completeTask = (data: { taskId: string }) => {
  return fetcher("/task", { action: "complete", ...data }, "PUT");
};

export const deleteTask = (data: { taskId: string }) => {
  return fetcher("/task", data, "DELETE");
};
