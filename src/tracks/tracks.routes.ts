import { Router } from "express";
import { trackInputSchema } from "./track.schema.ts";
import type { TrackService } from "./track.service.ts";

export function createTrackRouter(service: TrackService): Router {
  const router = Router();

  router.get("/:id", async (req, res) => {
    const track = await service.getById(req.params.id);
    res.json(track);
  });

  router.post("/", async (req, res) => {
    const input = trackInputSchema.parse(req.body);
    const track = await service.create(input);
    res
      .status(201)
      .location(`/tracks/${encodeURIComponent(track.id)}`)
      .json(track);
  });

  return router;
}
