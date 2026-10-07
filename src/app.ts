import express, { type Express } from "express";
import { notFoundHandler, errorHandler } from "./error-handler.ts";
import { createTrackRouter } from "./tracks/tracks.routes.ts";
import { TrackService } from "./tracks/track.service.ts";
import type { TrackRepository } from "./tracks/track.repository.ts";
import { TrackInMemoryRepository } from "./tracks/track-in-memory.repository.ts";
import { pinoHttp } from "pino-http";
import { logger } from "./logger.ts";

export function createApp(
  trackRepository: TrackRepository = new TrackInMemoryRepository(),
): Express {
  const app = express();
  app.disable("x-powered-by"); // Remove 'X-Powered-By: Express' from headers for security

  app.use(pinoHttp({ logger }));
  app.use(express.json({ limit: "100kb" }));

  app.get("/healthz", (_req, res) => {
    res.json({ status: "OK" });
  });

  app.use("/tracks", createTrackRouter(new TrackService(trackRepository)));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
