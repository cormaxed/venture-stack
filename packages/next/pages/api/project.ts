import type { NextApiRequest, NextApiResponse } from "next";
import { authorizeRoute } from "../../lib/auth";
import toArray from "../../lib/query-string";
import {
  getUserProjects,
  getSystemProjects,
  newProject,
} from "../../datasource/project-ds";
import { Project, User } from "../../types/types";
import { sendNotAllowed, sendResponse } from "../../lib/http";
import { withErrorHandler } from "../../lib/api-logger";

const toProject = (
  id: string,
  name: string,
  icon: string,
  subtype: string,
  user: User
) => {
  return {
    id,
    name,
    user_id: user.id,
    created_at: user.created_at,
    updated_at: user.created_at,
    icon,
    type: "system",
    subtype,
    color: null,
    parent_id: null,
  };
};

const getFavourites = (user: User) => {
  const projects: Project[] = [];
  projects.push(toProject("ALL_TASKS", "All Tasks", "FavIcon", "filter", user));

  return projects;
};

const supportedTypes = ["user", "system"];
const typeFunctions = {
  user: getUserProjects,
  system: getSystemProjects,
};

const getProjects = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) => {
  const { structure } = req.query;
  const asTree = structure !== "flat";
  let { types } = req.query;

  const projects = {
    system: [],
    user: [],
    favourites: [],
  };

  types = toArray(types, supportedTypes);

  await Promise.all(
    types.map(async (type) => {
      if (supportedTypes.includes(type)) {
        projects[type] = await typeFunctions[type](user, asTree);
      } else {
        projects[type] = [];
      }
    })
  );

  projects.favourites = getFavourites(user);

  sendResponse(res, projects);
};

const createProject = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) => {
  const { name, parentId, color } = req.body;

  const result = await newProject(user, { name, parentId, color });

  sendResponse(res, result);
};

const methodFunctions = {
  GET: getProjects,
  POST: createProject,
};

export default withErrorHandler(
  authorizeRoute(
    async (req: NextApiRequest, res: NextApiResponse, user: User) => {
      const { method } = req;

      if (methodFunctions[method]) {
        await methodFunctions[method](req, res, user);
      } else {
        sendNotAllowed(res, { error: `Method: ${method} not supported` });
      }
    }
  )
);
