import { describe, expect, it } from "vitest";
import { trackInputSchema } from "./track.schema.ts";

const dummyTrack = {
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
