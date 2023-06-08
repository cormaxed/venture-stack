import { Kysely, sql } from "kysely";

const schema = "udoit";
/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema.createSchema(schema).execute();

  await db.schema
    .withSchema(schema)
    .createTable("user")
    .addColumn("id", "varchar", (col) => col.primaryKey())
    .addColumn("email", "varchar", (col) => col.notNull().unique())
    .addColumn("firstname", "varchar")
    .addColumn("lastname", "varchar")
    .addColumn("password", "varchar")
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamp")
    .execute();

  await db.schema
    .withSchema(schema)
    .createTable("project")
    .addColumn("id", "varchar", (col) => col.primaryKey())
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("description", "varchar")
    .addColumn("icon", "varchar")
    .addColumn("color", "varchar")
    .addColumn("type", "varchar")
    .addColumn("subtype", "varchar")
    .addColumn("user_id", "varchar", (col) =>
      col.references("user.id").notNull()
    )
    .addForeignKeyConstraint(
      "project_user_id_fk",
      ["user_id"],
      "user",
      ["id"],
      (cb) => cb.onDelete("restrict").onUpdate("cascade")
    )
    .addColumn("parent_id", "varchar", (col) => col.references("project.id"))
    .addForeignKeyConstraint(
      "project_parent_project_id_fk",
      ["parent_id"],
      "project",
      ["id"],
      (cb) => cb.onDelete("set null").onUpdate("cascade")
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamp")
    .execute();

  await db.schema
    .withSchema(schema)
    .createTable("task")
    .addColumn("id", "varchar", (col) => col.primaryKey())
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("description", "varchar")
    .addColumn("deadline", "timestamp")
    .addColumn("priority", "int")
    .addColumn("done", "boolean")
    .addColumn("archived", "boolean")
    .addColumn("project_id", "varchar", (col) =>
      col.notNull().references("project.id")
    )
    .addForeignKeyConstraint(
      "task_project_id_fk",
      ["project_id"],
      "project",
      ["id"],
      (cb) => cb.onDelete("restrict").onUpdate("cascade")
    )
    .addColumn("user_id", "varchar", (col) =>
      col.notNull().references("user.id")
    )
    .addForeignKeyConstraint(
      "task_user_id_fk",
      ["user_id"],
      "user",
      ["id"],
      (cb) => cb.onDelete("restrict").onUpdate("cascade")
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamp")
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.withSchema(schema).dropTable("user").execute();
  await db.withSchema(schema).dropTable("project").execute();
  await db.withSchema(schema).dropTable("task").execute();
}
