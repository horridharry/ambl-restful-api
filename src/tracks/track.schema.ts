import { z } from "zod";
import { trackUrn } from "./track.ts";

export const trackInputSchema = z
  .strictObject({
    type: z.literal("track").optional(),
    id: z.string().min(1),
    urn: z.string().optional(),
    titles: z.strictObject({
      primary: z.string().min(1),
      secondary: z.string().nullable().default(null),
      tertiary: z.string().nullable().default(null),
    }),
    availability: z.strictObject({
      from: z.iso.datetime(),
      to: z.iso.datetime(),
      label: z.string().optional(),
    }),
  })
  .refine(
    (input) => input.urn === undefined || input.urn === trackUrn(input.id),
    {
      message: "the urn must match the id.",
      path: ["urn"],
    },
  )
  .refine(
    (input) =>
      Date.parse(input.availability.to) > Date.parse(input.availability.from),
    {
      message: "'to' must be after 'from'.",
      path: ["availability", "to"],
    },
  );

export type TrackInput = z.infer<typeof trackInputSchema>;
