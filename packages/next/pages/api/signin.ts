import { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "cookies-next";
import bcrypt from "bcryptjs";
import { createAuthToken } from "../../lib/auth";
import { getUser } from "../../datasource/user-ds";
import { Token } from "../../types/types";
import { logger, withErrorHandler } from "../../lib/api-logger";
import { sendResponse, sendUnAuthorised } from "../../lib/http";
import { AppConfig } from "../../lib/config";

export default withErrorHandler(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (AppConfig.auth0ClientId) {
    throw new Error("Not supported when auth0 is enabled");
  }
  const { email, password } = req.body;

  try {
    const user = await getUser({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new Error("Invalid password");
    }

    const token: Token = { accessToken: await createAuthToken(user) };
    setCookie("access_token", token.accessToken, {
      req,
      res,
      maxAge: 60 * 60 * 24,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    sendResponse(res, token);
  } catch (error) {
    logger.error("UnAuthorised Request %o", error);
    sendUnAuthorised(res, { error: "Not Authorised" });
  }
});
