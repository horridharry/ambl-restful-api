import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { TrackAlreadyExistsError, TrackNotFoundError } from "./errors.ts";

export const notFoundHandler: RequestHandler = (_req, res) => {
  res
    .status(404)
    .json({ status: 404, title: "Not Found", detail: "Route not found" });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      status: 400,
      title: "Invalid track",
      detail: "The request body did not pass validation",
      errors: err.issues.map((issue) => ({
        path: issue.path.map(String).join("."),
        message: issue.message,
      })),
    });
    return;
  }

  if (err instanceof TrackNotFoundError) {
    res
      .status(404)
      .json({ status: 404, title: "Not Found", detail: err.message });
    return;
  }

  if (err instanceof TrackAlreadyExistsError) {
    res
      .status(409)
      .json({ status: 409, title: "Conflict", detail: err.message });
    return;
  }

  if (err.type === "entity.parse.failed") {
    res.status(400).json({
      status: 400,
      title: "Invalid JSON",
      detail: "The request body is not valid JSON",
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    status: 500,
    title: "Internal Server Error",
    detail: "Something went wrong",
  });
};
