import {
  Config,
  Cron,
  NextjsSite,
  Queue,
  RDS,
  StackContext,
} from "sst/constructs";

export function VentureStack({ stack, app }: StackContext) {
  // Create a RDS Posgres database
  // For production create a config with autoPause disabled
  const rds = new RDS(stack, "Cluster", {
    engine: "postgresql11.13",
    defaultDatabaseName: "venture_db",
    migrations: "packages/core/migrations",
    types: "packages/core/src/kysely-types.ts",
    scaling: {
      autoPause: true,
      minCapacity: "ACU_2",
      maxCapacity: "ACU_2",
    },
  });

  // Management API Secrets
  const AUTH0_DOMAIN = new Config.Secret(stack, "AUTH0_DOMAIN");
  const AUTH0_MGMT_CLIENT_ID = new Config.Secret(stack, "AUTH0_MGMT_CLIENT_ID");
  const AUTH0_MGMT_SECRET = new Config.Secret(stack, "AUTH0_MGMT_SECRET");

  // Client Authentication Secrets
  const AUTH0_SECRET = new Config.Secret(stack, "AUTH0_SECRET");
  const AUTH0_CLIENT_SECRET = new Config.Secret(stack, "AUTH0_CLIENT_SECRET");
  const JWT_SECRET = new Config.Secret(stack, "JWT_SECRET");

  // Create a Next.js site
  const site = new NextjsSite(stack, "Site", {
    path: "packages/next",
    environment: {
      REGION: app.region,
      RDS_DATABASE: rds.defaultDatabaseName,
      RDS_SECRET_ARN: rds.secretArn,
      RDS_RESOURCE_ARN: rds.clusterArn,
    },
    bind: [rds, AUTH0_SECRET, AUTH0_CLIENT_SECRET, JWT_SECRET],
  });

  const queue = new Queue(stack, "Queue", {
    consumer: "packages/functions/src/queue.handle",
  });
  queue.bind([rds, AUTH0_DOMAIN, AUTH0_MGMT_CLIENT_ID, AUTH0_MGMT_SECRET]);

  const job = new Cron(stack, "cron", {
    schedule: "rate(15 minutes)",
    job: "packages/functions/src/cron.userSyncJob",
  });

  job.bind([rds, queue]);

  // Show the site URL in the output
  stack.addOutputs({
    URL: site.url || "http://localhost:3000",
  });
}
