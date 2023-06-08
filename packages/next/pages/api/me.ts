import { NextApiRequest, NextApiResponse } from "next";
import { authorizeRoute } from "../../lib/auth";
import { getProfile } from "../../datasource/profile-ds";
import { User } from "../../types/types";
import { sendResponse } from "../../lib/http";
import { withErrorHandler } from "../../lib/api-logger";

export default withErrorHandler(
  authorizeRoute(
    async (req: NextApiRequest, res: NextApiResponse, user: User) => {
      const result = await getProfile(user);

      sendResponse(res, result);
    }
  )
);
