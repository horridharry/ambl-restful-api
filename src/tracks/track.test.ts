import { describe, expect, it } from "vitest";
import { availabilityLabel } from "./track.ts";

describe("availabilityLabel", () => {
  it("Counts whole days between two dates and rounds down", () => {
    expect(
      availabilityLabel("2019-02-13T11:03:05Z", "2019-03-15T11:00:00Z"),
    ).toBe("Available for 29 days");
  });

  it("Use the singular form for exactly 1 day", () => {
    expect(
      availabilityLabel("2026-01-01T00:00:00Z", "2026-01-02T00:00:00Z"),
    ).toBe("Available for 1 day");
  });
});
