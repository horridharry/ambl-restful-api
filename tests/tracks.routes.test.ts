import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.ts";
import dummyTrack from "./DUMMY_TRACK.ts";

describe("POST /tracks", () => {
  it("Creates a track and returns code 201 with a Location header", async () => {
    const res = await request(createApp()).post("/tracks").send(dummyTrack);

    expect(res.status).toBe(201);
    expect(res.headers.location).toBe("/tracks/nznx3r");
    expect(res.body).toEqual(dummyTrack);
  });

  it("Returns a 400 with field errors for an invalid track", async () => {
    const res = await request(createApp())
      .post("/tracks")
      .send({ ...dummyTrack, titles: { primary: "" } });

    expect(res.status).toBe(400);
    expect(res.body.errors).toContainEqual(
      expect.objectContaining({ path: "titles.primary" }),
    );
  });

  it("Returns a 400 for an invalid JSON", async () => {
    const res = await request(createApp())
      .post("/tracks")
      .set("Content-Type", "application/json")
      .send('{"id":');

    expect(res.status).toBe(400);
  });

  it("Returns a 409 when there is a track with the same id", async () => {
    const app = createApp();
    await request(app).post("/tracks").send(dummyTrack);

    const res = await request(app).post("/tracks").send(dummyTrack);

    expect(res.status).toBe(409);
  });
});

describe("GET /tracks/:id", () => {
  it("Returns a track that was recently added", async () => {
    const app = createApp();
    await request(app).post("/tracks").send(dummyTrack);

    const res = await request(app).get("/tracks/nznx3r");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(dummyTrack);
  });

  it("Returns a 404 with a JSON error for an unknown id", async () => {
    const res = await request(createApp()).get("/tracks/unknown");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      status: 404,
      title: "Not Found",
      detail: "No track found with id 'unknown'",
    });
  });
});
