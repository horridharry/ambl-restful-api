import express, { type Express } from "express";

export function createApp(): Express {
  const app = express();
  app.disable("x-powered-by"); // Remove 'X-Powered-By: Express' from headers for security

  app.get("/healthz", (_req, res) => {
    res.json({ status: "OK" });
  });

  return app;
}
