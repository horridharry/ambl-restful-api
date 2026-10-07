import { createApp } from "./app.ts";

const port = Number(process.env.PORT ?? 3000);
import { logger } from "./logger.ts";

const server = createApp().listen(port, () => {
  logger.info(`API listening on http://localhost:${port}`);
}); // for future reference change this to createApp(new DatabaseTrackRepository()) for switching from in-memory to a db repo

function shutdown(signal: string) {
  logger.info({ signal }, "Shutting down");
  server.close(() => process.exit(0));
  setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
