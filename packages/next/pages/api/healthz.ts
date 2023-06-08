import { sql } from "kysely";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../lib/db";
import { withErrorHandler } from "../../lib/api-logger";
import { sendResponse } from "../../lib/http";
import { Healthz } from "../../types/types";

/**
 * @swagger
 * /api/healthz:
 *   get:
 *     description: Health check that tests database connectivity and returns current time
 *     responses:
 *       200:
 *         description: Health check successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Healthz'
 *       500:
 *         description: Health check failed
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 */
export default withErrorHandler(async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Healthz>
) {
  await sql`select 1`.execute(db);
  sendResponse(res, { time: new Date().toISOString() });
});
