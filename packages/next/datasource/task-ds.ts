import { DeleteResult, InsertResult, UpdateResult } from "kysely";
import { User, Task } from "../types/types";
import { db, getInsertRowDefaults } from "../lib/db";

const futureDate = (days: number) =>
  new Date(new Date().setDate(new Date().getDate() + days));

const filters = {
  Today: {
    deadline: {
      lt: new Date(futureDate(1).setHours(0, 0, 0)),
      gte: new Date(new Date().setHours(0, 0, 0)),
    },
  },
  Upcoming: {
    deadline: {
      lt: new Date(futureDate(10).setHours(0, 0, 0)),
      gte: new Date(new Date().setHours(0, 0, 0)),
    },
  },
};

const getTasksByProject = async (
  user: User,
  projectId: string
): Promise<Task[]> => {
  let qb = db
    .selectFrom("udoit.task")
    .innerJoin("udoit.project", "udoit.task.project_id", "udoit.project.id")
    .selectAll("udoit.task")
    .select("udoit.project.name as project_name")
    .where("udoit.task.user_id", "=", user.id)
    .where("done", "is not", true)
    .orderBy("priority", "asc")
    .orderBy("deadline", "asc");

  if (projectId === "ALL_TASKS") {
    // No filtering
  } else {
    const project = await db
      .selectFrom("udoit.project")
      .selectAll("udoit.project")
      .where("id", "=", projectId)
      .executeTakeFirstOrThrow();

    if (project.subtype === "filter") {
      qb = qb
        .where("deadline", "<", filters[project.name].deadline.lt)
        .where("deadline", ">=", filters[project.name].deadline.gte);
    } else {
      qb = qb.where("project_id", "=", projectId);
    }
  }

  const tasks = (await qb.execute()) as Task[];

  return tasks;
};

const newTask = async (
  user: User,
  task: {
    name: string;
    description: string;
    priority: number;
    deadline: Date;
    projectId: string;
  }
): Promise<InsertResult> => {
  const result = await db
    .insertInto("udoit.task")
    .values({
      ...getInsertRowDefaults(),
      name: task.name,
      description: task.description,
      priority: task.priority ? task.priority : null,
      deadline: task.deadline ? task.deadline : null,
      project_id: task.projectId,
      user_id: user.id,
    })
    .executeTakeFirstOrThrow();

  return result;
};

const updateTask = async (
  user: User,
  task: {
    taskId: string;
    name: string;
    description: string;
    priority: number;
    deadline: Date;
    projectId: string;
  }
): Promise<UpdateResult> => {
  const result = await db
    .updateTable("udoit.task")
    .where("id", "=", task.taskId)
    .set({
      name: task.name,
      description: task.description,
      priority: task.priority ? task.priority : null,
      deadline: task.deadline ? task.deadline : null,
      project_id: task.projectId,
    })
    .executeTakeFirstOrThrow();

  return result;
};

const completeTask = async (
  user: User,
  taskId: string
): Promise<UpdateResult> => {
  const result = await db
    .updateTable("udoit.task")
    .where("id", "=", taskId)
    .set({ done: true })
    .executeTakeFirstOrThrow();

  return result;
};

const removeTask = async (
  user: User,
  taskId: string
): Promise<DeleteResult> => {
  const result = await db
    .deleteFrom("udoit.task")
    .where("id", "=", taskId)
    .executeTakeFirstOrThrow();

  return result;
};

export { getTasksByProject, newTask, updateTask, completeTask, removeTask };
