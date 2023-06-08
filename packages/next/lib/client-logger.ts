import * as Sentry from "@sentry/react";
import pino from "pino";

const consoleLogger = pino({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  base: {
    env: process.env.NODE_ENV ? process.env.NODE_ENV : "unknown",
  },
});

if (process.env.NEXT_PUBLIC_CLIENT_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_CLIENT_SENTRY_DSN,
    integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,

    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

const logger = {
  error: (error: Error) => {
    if (process.env.NEXT_PUBLIC_CLIENT_SENTRY_DSN) {
      Sentry.captureException(error);
    } else {
      consoleLogger.error(error);
    }
  },
  message: (message: string, level: Sentry.SeverityLevel) => {
    if (process.env.NEXT_PUBLIC_CLIENT_SENTRY_DSN) {
      Sentry.captureMessage(message, level);
    } else {
      consoleLogger[level](message);
    }
  },
};

export default logger;
