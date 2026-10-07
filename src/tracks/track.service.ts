import { TrackAlreadyExistsError, TrackNotFoundError } from "../errors.ts";
import { availabilityLabel, trackUrn, type Track } from "./track.ts";
import type { TrackRepository } from "./track.repository.ts";
import type { TrackInput } from "./track.schema.ts";

export class TrackService {
  private readonly repository: TrackRepository;

  constructor(repository: TrackRepository) {
    this.repository = repository;
  }

  async getById(id: string): Promise<Track> {
    const track = await this.repository.findById(id);
    if (!track) {
      throw new TrackNotFoundError(id);
    }
    return track;
  }

  async create(input: TrackInput): Promise<Track> {
    if (await this.repository.findById(input.id)) {
      throw new TrackAlreadyExistsError(input.id);
    }

    const track: Track = {
      type: "track",
      id: input.id,
      urn: trackUrn(input.id),
      titles: input.titles,
      availability: {
        from: input.availability.from,
        to: input.availability.to,
        label: availabilityLabel(
          input.availability.from,
          input.availability.to,
        ),
      },
    };

    await this.repository.save(track);
    return track;
  }
}
