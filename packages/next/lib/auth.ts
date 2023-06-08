import { NextApiRequest, NextApiResponse } from "next";
import { getCookie } from "cookies-next";
import jwt from "jsonwebtoken";
import { getUser } from "../datasource/user-ds";
import { User } from "../types/types";
import { sendUnAuthorised } from "./http";
import { logger } from "./api-logger";
import { AppConfig } from "./config";
import { createExternalProfile } from "../datasource/profile-ds";
import auth0 from "./auth0";

type JwtUser = {
  email: string;
  id: string;
  time: Date;
  sub: string;
};

const createAuthToken = (user: User) => {
  const token = jwt.sign(
    {
      email: user.email,
      id: user.id,
      time: Date.now(),
    },
    AppConfig.jtwSecret,
    {
      expiresIn: process.env.JWT_EXPIRY,
      algorithm: "HS256",
    }
  );

  return token;
};

const validateToken = (token: string): JwtUser => {
  const user = jwt.verify(token, AppConfig.jtwSecret) as JwtUser;
  return user;
};

const authorizeRouteAuth0 = (
  // eslint-disable-next-line no-unused-vars
  handler: (req: NextApiRequest, res: NextApiResponse, user: User) => void
) => {
  return auth0.withApiAuthRequired(
    async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
        const session = await auth0.getSession(req, res);

        if (!session) {
          throw new Error("Invalid session");
        }

        const user = await getUser({ id: session.user.sub });

        if (!user) {
          logger.debug("User not found creating profile");
          createExternalProfile(session.user.sub, session.user.name);
        }

        return handler(req, res, user);
      } catch (error) {
        logger.error("UnAuthorised Request %o", error);
        sendUnAuthorised(res, { error: "Not Authorised" });
      }
    }
  );
};

const authorizeRouteSelfSigned = (
  // eslint-disable-next-line no-unused-vars
  handler: (req: NextApiRequest, res: NextApiResponse, user: User) => void
) => {
  return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
      const accessToken = getCookie("access_token", { req, res });

      if (!accessToken) {
        throw new Error("Authorization header missing");
      }

      const { id } = validateToken(accessToken.valueOf() as string);

      const user = await getUser({ id });

      if (!user) {
        throw new Error("Invalid user");
      }

      return handler(req, res, user);
    } catch (error) {
      sendUnAuthorised(res, { error: "Not Authorised" });
    }
  };
};

const authorizeRoute = AppConfig.auth0ClientId
  ? authorizeRouteAuth0
  : authorizeRouteSelfSigned;

export { createAuthToken, validateToken, authorizeRoute };
