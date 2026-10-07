import type { Track } from "./track.ts";

export interface TrackRepository {
  findById(id: string): Promise<Track | undefined>;
  save(track: Track): Promise<void>;
}
