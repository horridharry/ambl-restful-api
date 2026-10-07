import { describe, expect, it } from "vitest";
import { trackInputSchema } from "../src/tracks/track.schema.ts";
import dummyTrack from "./DUMMY_TRACK.ts";

describe("trackInputSchema", () => {
  it("Accepts the dummy track", () => {
    expect(trackInputSchema.safeParse(dummyTrack).success).toBe(true);
  });

  it("Accepts a very minimal track", () => {
    const minimalTrack = {
      id: "nznx3r",
      titles: { primary: "Minimal Track" },
      availability: {
        from: "2019-02-13T11:03:05Z",
        to: "2019-03-15T11:00:00Z",
      },
    };
    expect(trackInputSchema.safeParse(minimalTrack).success).toBe(true);
  });

  it("Rejects a urn that doesn't match the id", () => {
    const result = trackInputSchema.safeParse({
      ...dummyTrack,
      urn: "urn:bbc:sounds:track:other",
    });
    expect(result.success).toBe(false);
  });

  it.each([
    ["Missing primary title", { ...dummyTrack, titles: { primary: "" } }],
    [
      "Missing availability",
      { ...dummyTrack, availability: { from: "", to: "" } },
    ],
    ["Missing id", { ...dummyTrack, id: "" }],
    ["Missing urn", { ...dummyTrack, urn: "" }],
    [
      "A date that isnt ISO 8601",
      {
        ...dummyTrack,
        availability: { from: "not-a-date", to: "also-not-a-date" },
      },
    ],

    [
      "A date that comes before the from date",
      {
        ...dummyTrack,
        availability: {
          from: "2019-03-15T11:00:00Z",
          to: "2019-02-13T11:03:05Z",
        },
      },
    ],
    ["A type that isnt track", { type: "not-a-track" }],
    [
      "A urn that doesnt match the id",
      { ...dummyTrack, urn: "urn:bbc:sounds:track:other" },
    ],

    ["An unknown field", { unknownField: "value" }],
  ])("Rejects %s", (_description, track) => {
    const result = trackInputSchema.safeParse(track);
    expect(result.success).toBe(false);
  });
});
