import {
  Expression,
  Kysely,
  PostgresDialect,
  RawBuilder,
  Simplify,
  sql,
  Dialect,
} from "kysely";
import { DataApiDialect } from "kysely-data-api";
import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";
import { RDSData } from "@aws-sdk/client-rds-data";
import { Database } from "@venture-stack/core/src/kysely-types";
import { logger } from "./api-logger";

const initDb = (): Kysely<Database> => {
  if (process.env.DATABASE_URL) {
    return new Kysely<Database>({
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: process.env.DATABASE_URL,
        }),
      }),
      log(event) {
        if (event.level === "query") {
          logger.debug(event.query.sql);
          logger.debug(event.query.parameters);
        }
      },
    });
  }
  return new Kysely<Database>({
    dialect: new DataApiDialect({
      mode: "postgres",
      driver: {
        database: process.env.RDS_DATABASE,
        secretArn: process.env.RDS_SECRET_ARN,
        resourceArn: process.env.RDS_RESOURCE_ARN,
        client: new RDSData({}),
      },
    }) as unknown as Dialect,
  });
};

export const db = initDb();

export const jsonArrayFrom = <O>(
  expr: Expression<O>
): RawBuilder<Simplify<O>[]> => {
  return sql`(select coalesce(json_agg(agg), '[]') from ${expr} as agg)`;
};

export const jsonObjectFrom = <O>(
  expr: Expression<O>
): RawBuilder<Simplify<O>> => {
  return sql`(select to_json(obj) from ${expr} as obj)`;
};

export const getInsertRowDefaults = (id?: string) => {
  return {
    id: id || uuidv4(),
    created_at: new Date(),
    updated_at: new Date(),
  };
};
