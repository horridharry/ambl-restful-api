import type { Track } from "../track.ts";
import type { TrackRepository } from "./track.repository.ts";

export class TrackInMemoryRepository implements TrackRepository {
  private readonly tracks = new Map<string, Track>();

  async findById(id: string): Promise<Track | undefined> {
    return this.tracks.get(id);
  }

  async save(track: Track): Promise<void> {
    this.tracks.set(track.id, track);
  }
}
