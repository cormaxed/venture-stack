import { db, getInsertRowDefaults } from "../lib/db";
import { EntityId, Project, User } from "../types/types";

export const createSystemProjects = async (userId: string) => {
  const systemProjects = [
    { name: "Inbox", icon: "InboxIcon", subtype: "task" },
    { name: "Today", icon: "TodayIcon", subtype: "filter" },
    { name: "Upcoming", icon: "UpcomingIcon", subtype: "filter" },
  ];

  systemProjects.forEach(async (p) => {
    db.insertInto("udoit.project")
      .values({
        ...getInsertRowDefaults(),
        name: p.name,
        icon: p.icon,
        // eslint-disable-next-line camelcase
        user_id: userId,
        type: "system",
        subtype: p.subtype,
      })
      .executeTakeFirstOrThrow();
  });
};

export const getUserProjects = async (
  user: User,
  asTree: boolean = true
): Promise<Project[]> => {
  const qb = db
    .selectFrom("udoit.project")
    .selectAll("udoit.project")
    .where("user_id", "=", user.id)
    .where("type", "=", "user")
    .orderBy("name", "asc");

  if (asTree) {
    const uniqueProjects = {};
    const userProjects = await qb.execute();

    // make it easy to access by id
    userProjects.forEach((p) => {
      uniqueProjects[p.id] = p;
    });

    userProjects.forEach((p) => {
      if (p.parent_id) {
        uniqueProjects[p.parent_id].children = [
          ...(uniqueProjects[p.parent_id].children || []),
          p,
        ];
      }
    });

    const rootProjects = (Object.values(uniqueProjects) as Project[]).filter(
      (p) => !p.parent_id
    );

    return rootProjects;
  }

  const userProjects = (await qb.execute()) as Project[];
  return userProjects;
};

export const getSystemProjects = async (user: User): Promise<Project[]> => {
  return (await db
    .selectFrom("udoit.project")
    .selectAll("udoit.project")
    .where("user_id", "=", user.id)
    .where("type", "=", "system")
    .orderBy("name", "asc")
    .execute()) as Project[];
};

export const newProject = async (
  user: User,
  project: { name: string; color: string; parentId: string }
): Promise<EntityId> => {
  const defaults = getInsertRowDefaults();
  await db
    .insertInto("udoit.project")
    .values({
      ...defaults,
      name: project.name,
      color: project.color,
      parent_id: project.parentId,
      user_id: user.id,
      type: "user",
      subtype: "task",
      icon: "CircleIcon",
    })
    .executeTakeFirstOrThrow();

  return { id: defaults.id };
};
