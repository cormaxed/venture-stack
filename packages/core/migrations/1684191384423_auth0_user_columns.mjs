import { Kysely } from "kysely";

const schema = "udoit";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .withSchema(schema)
    .alterTable("user")
    .addColumn("last_ip", "varchar")
    .addColumn("last_login", "timestamp")
    .addColumn("logins_count", "integer")
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema
    .withSchema(schema)
    .updateTable("user")
    .dropColumn("last_ip")
    .dropColumn("last_login")
    .dropColumn("logins_count")
    .execute();
}
