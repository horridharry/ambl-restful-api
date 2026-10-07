import { beforeEach, describe, expect, it } from "vitest";
import { TrackInMemoryRepository } from "../src/tracks/track-in-memory.repository.ts";
import track from "./DUMMY_TRACK.ts";

describe("TrackInMemoryRepository", () => {
  let repository: TrackInMemoryRepository;

  beforeEach(() => {
    repository = new TrackInMemoryRepository();
  });

  it("Returns a track by its id", async () => {
    await repository.save(track);

    expect(await repository.findById("nznx3r")).toEqual(track);
  });

  it("Returns an undefined for an unknown id", async () => {
    expect(await repository.findById("unknown")).toBeUndefined();
  });

  it("Replaces a track saved again with the same id", async () => {
    await repository.save(track);
    const updated = {
      ...track,
      titles: { ...track.titles, primary: "Updated" },
    };

    await repository.save(updated);

    expect(await repository.findById("nznx3r")).toEqual(updated);
  });
});
