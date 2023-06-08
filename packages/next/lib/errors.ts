import { NextRouter } from "next/router";
import { NotAuthorisedError } from "./fetcher";
import logger from "./client-logger";
import { BrowserConfig } from "./browser-config";

const AUTH_URL = BrowserConfig.auth0Enabled ? "/api/auth/login" : "/signin";
export const handleAuthError = (error: Error, router: NextRouter): boolean => {
  if (error instanceof NotAuthorisedError) {
    logger.message("Not Authorised, redirecting to signin", "debug");
    router.replace(AUTH_URL);
    return true;
  }

  return false;
};
