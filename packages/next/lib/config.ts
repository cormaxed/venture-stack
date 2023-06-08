import { Config } from "sst/node/config";

export const AppConfig = {
  auth0BaseUrl: process.env.AUTH0_BASE_URL,
  auth0IssuerBaseUrl: process.env.AUTH0_ISSUER_BASE_URL,
  auth0ClientId: process.env.AUTH0_CLIENT_ID,
  auth0Secret: process.env.AUTH0_SECRET || Config.AUTH0_SECRET,
  auth0ClientSecret:
    process.env.AUTH0_CLIENT_SECRET || Config.AUTH0_CLIENT_SECRET,
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  jtwSecret: process.env.JWT_SECRET || Config.JWT_SECRET,
};
