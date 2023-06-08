import { Kysely, PostgresDialect, Dialect } from "kysely";
import { DataApiDialect } from "kysely-data-api";
import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";
import { RDSData } from "@aws-sdk/client-rds-data";
import { Database } from "./kysely-types";
import { RDS } from "sst/node/rds";

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
          //logger.debug(event.query.sql);
          //logger.debug(event.query.parameters);
        }
      },
    });
  }
  return new Kysely<Database>({
    dialect: new DataApiDialect({
      mode: "postgres",
      driver: {
        database: process.env.RDS_DATABASE || RDS.Cluster.defaultDatabaseName,
        secretArn: process.env.RDS_SECRET_ARN || RDS.Cluster.secretArn,
        resourceArn: process.env.RDS_RESOURCE_ARN || RDS.Cluster.clusterArn,
        client: new RDSData({}),
      },
    }) as unknown as Dialect,
  });
};

export const db: Kysely<Database> = initDb();

export const getInsertRowDefaults = (id?: string) => {
  return {
    id: id || uuidv4(),
    created_at: new Date(),
    updated_at: new Date(),
  };
};
