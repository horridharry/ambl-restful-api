import { beforeEach, describe, expect, it } from "vitest";
import { TrackAlreadyExistsError, TrackNotFoundError } from "../errors.ts";
import { TrackInMemoryRepository } from "./repository/track-in-memory.repository.ts";
import type { TrackInput } from "./track.schema.ts";
import { TrackService } from "./track.service.ts";

const input: TrackInput = {
  type: "track",
  id: "nznx3r",
  urn: "urn:bbc:sounds:track:nznx3r",
  titles: {
    primary: "AC/DC",
    secondary: "Highway to Hell",
    tertiary: null,
  },
  availability: {
    from: "2019-02-13T11:03:05Z",
    to: "2019-03-15T11:00:00Z",
    label: "Available for 29 days",
  },
};

describe("TrackService", () => {
  let service: TrackService;

  beforeEach(() => {
    service = new TrackService(new TrackInMemoryRepository());
  });

  it("Create a track with server generated fields: urn, availability label", async () => {
    expect(await service.create(input)).toEqual({
      type: "track",
      id: "nznx3r",
      urn: "urn:bbc:sounds:track:nznx3r",
      titles: {
        primary: "AC/DC",
        secondary: "Highway to Hell",
        tertiary: null,
      },
      availability: {
        from: "2019-02-13T11:03:05Z",
        to: "2019-03-15T11:00:00Z",
        label: "Available for 29 days",
      },
    });
  });

  it("Return a newly created track by its id after creating a track", async () => {
    const created = await service.create(input);

    expect(await service.getById("nznx3r")).toEqual(created);
  });

  it("Reject an attempt to create a track with a duplicate id", async () => {
    await service.create(input);

    await expect(service.create(input)).rejects.toThrow(
      TrackAlreadyExistsError,
    );
  });

  it("Throw an error when attempting to get a track that does not exist", async () => {
    await expect(service.getById("unknown")).rejects.toThrow(
      TrackNotFoundError,
    );
  });
});
