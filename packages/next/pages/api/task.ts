import type { NextApiRequest, NextApiResponse } from "next";
import { authorizeRoute } from "../../lib/auth";
import toArray from "../../lib/query-string";
import {
  completeTask,
  getTasksByProject,
  newTask,
  removeTask,
  updateTask,
} from "../../datasource/task-ds";
import { User } from "../../types/types";
import { sendNotAllowed, sendResponse } from "../../lib/http";
import { withErrorHandler } from "../../lib/api-logger";

const getTasks = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) => {
  const { projectId } = req.query;

  return getTasksByProject(user, toArray(projectId, [])[0]);
};

const createTask = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) => {
  const { name, description, priority, deadline, projectId } = req.body;

  return newTask(user, {
    name,
    description,
    priority,
    deadline: deadline ? new Date(deadline) : null,
    projectId,
  });
};

const editTask = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) => {
  const { action, taskId, name, description, priority, deadline, projectId } =
    req.body;

  if (action === "complete") {
    return completeTask(user, taskId);
  }

  return updateTask(user, {
    taskId,
    name,
    description,
    priority,
    deadline: deadline ? new Date(deadline) : null,
    projectId,
  });
};

const deleteTask = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) => {
  const { taskId } = req.body;
  return removeTask(user, taskId);
};

const methodFunctions = {
  GET: getTasks,
  POST: createTask,
  PUT: editTask,
  DELETE: deleteTask,
};

export default withErrorHandler(
  authorizeRoute(
    async (req: NextApiRequest, res: NextApiResponse, user: User) => {
      const { method } = req;

      if (methodFunctions[method]) {
        const result = await methodFunctions[method](req, res, user);
        sendResponse(res, result);
      } else {
        sendNotAllowed(res, { error: `Method: ${method} not supported` });
      }
    }
  )
);
