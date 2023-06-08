# Schema Migration

Migrations are a set of files that contain the queries necessary to make updates to our database schema. They have an up function that's run while applying the migration. And a down function that's run while rolling back the migration.

Migration files are stored in `packages/core/migrations/`

## Creating A Schema Migration

You can create a new migration by running `yarn gen migration new`. This command will ask for the name of a migration and will generate a new file with the current timestamp.

Migration files are named with a timestamp to prevent naming conflicts when you are working with your team.

## Applying A Migration

Migrations are automatically applied in non-development stages (environments) when you run `sst deploy`.
In a development environment, you need to apply migrations manually.

From the SST development console:

* Navigate to RDS
* Select the `venture_db` database
* Select migrations
* Click Apply
