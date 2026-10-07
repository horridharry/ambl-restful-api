export class TrackNotFoundError extends Error {
  constructor(id: string) {
    super(`No matching track found for that id: '${id}'`);
    this.name = "TrackNotFoundError";
  }
}

export class TrackAlreadyExistsError extends Error {
  constructor(id: string) {
    super(`A track already exists with id '${id}'`);
    this.name = "TrackAlreadyExistsError";
  }
}
