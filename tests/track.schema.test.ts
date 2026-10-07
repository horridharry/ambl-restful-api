import { describe, expect, it } from "vitest";
import { trackInputSchema } from "../src/tracks/track.schema.ts";
import dummyTrack from "../src/tracks/DUMMY_TRACK.ts";

describe("trackInputSchema", () => {
  it("Accepts the dummy track", () => {
    expect(trackInputSchema.safeParse(dummyTrack).success).toBe(true);
  });

  it("Rejects a urn that doesn't match the id", () => {
    const result = trackInputSchema.safeParse({
      ...dummyTrack,
      urn: "urn:bbc:sounds:track:other",
    });
    expect(result.success).toBe(false);
  });
});
