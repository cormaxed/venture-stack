import { NextApiRequest, NextApiResponse } from "next";
import pino, { LoggerOptions } from "pino";
import { createWriteStream, Severity } from "pino-sentry";
import { sendServerError } from "./http";
import { AppConfig } from "./config";

const createLogger = () => {
  const pinoOptions: LoggerOptions = {
    level: process.env.NODE_ENV === "development" ? "debug" : "info",
    base: {
      env: process.env.NODE_ENV ? process.env.NODE_ENV : "unknown",
    },
  };

  if (AppConfig.sentryDsn) {
    const stream = createWriteStream({
      dsn: AppConfig.sentryDsn,
      sentryExceptionLevels: [
        Severity.Info,
        Severity.Warning,
        Severity.Error,
        Severity.Fatal,
      ],
    });
    return pino(pinoOptions, pino.multistream([stream, pino.destination(1)]));
  }
  return pino(pinoOptions);
};

export const logger = createLogger();

export const withErrorHandler = (
  // eslint-disable-next-line no-unused-vars
  handler: (req: NextApiRequest, res: NextApiResponse) => void
) => {
  return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
      await handler(req, res);
    } catch (error) {
      logger.error(error);
      sendServerError(res, { error: "Server Error" });
    }
  };
};
