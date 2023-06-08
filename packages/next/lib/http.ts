import { NextApiResponse } from "next";

const setHeaders = (res: NextApiResponse): NextApiResponse => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");

  return res;
};

export const sendResponse = (res: NextApiResponse, data: any) => {
  setHeaders(res).status(200).json(data);
};

export const sendServerError = (
  res: NextApiResponse,
  data: { error: string }
) => {
  setHeaders(res).status(500).json(data);
};

export const sendUnAuthorised = (res: NextApiResponse, data: any) => {
  setHeaders(res).status(401).json(data);
};

export const sendNotAllowed = (res: NextApiResponse, data: any) => {
  setHeaders(res).status(405).json(data);
};
