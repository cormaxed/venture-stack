import { NextApiRequest, NextApiResponse } from "next";
import { DatabaseError } from "pg";
import { setCookie } from "cookies-next";
import { createAuthToken } from "../../lib/auth";
import { Token } from "../../types/types";
import { logger, withErrorHandler } from "../../lib/api-logger";
import {
  sendServerError,
  sendUnAuthorised,
  sendResponse,
} from "../../lib/http";
import { AppConfig } from "../../lib/config";
import { createProfile } from "../../datasource/profile-ds";

export default withErrorHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (AppConfig.auth0ClientId) {
      throw new Error("Not supported when auth0 is enabled");
    }

    const { email, password } = req.body;

    let user;

    try {
      user = await createProfile(email, password);
    } catch (e) {
      if (e instanceof DatabaseError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === "23505") {
          sendUnAuthorised(res, { error: "User already exists" });
        } else {
          logger.error("Error creating new user %o", e);
          sendServerError(res, { error: "Unknown error. See server logs." });
        }
      }
      return;
    }

    const token: Token = { accessToken: createAuthToken(user) };

    setCookie("access_token", token.accessToken, {
      req,
      res,
      maxAge: 60 * 60 * 24,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    sendResponse(res, token);
  }
);
