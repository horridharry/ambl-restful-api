# AMBL Restful API

This is a small Restful JSON API for adding and fetching AMBL's `track` objects.

## How to run the API

You need Node 24 or later.

```bash
npm ci                      # clean install all packages.
npm run dev                 # start on http://localhost:3000
npm test                    # to run all tests
npm run check               # to run typecheck, lint, format and tests together
  npm run build && npm start  # compile to dist/ and run the compiled version
```

While the server is running, use the curl commands below to test it out:

```bash
curl -i -X POST localhost:3000/tracks -H "Content-Type: application/json" \
  -d '{"id":"bbc001","titles":{"primary":"AC/DC","secondary":"Highway to Hell"},"availability":{"from":"2019-02-13T11:03:05Z","to":"2019-03-15T11:00:00Z"}}'

curl -i localhost:3000/tracks/bbc001
```

## API Contract

The API has 3 endpoints.

#### GET `/healthz`

| Code | Meaning            |
| ---- | ------------------ |
| 200  | { "status": "OK" } |

#### GET `/tracks/:id`

| Code | Meaning                                          |
| ---- | ------------------------------------------------ |
| 200  | A `track` object                                 |
| 404  | Not Found. No matching `track` found for that id |

#### POST `/tracks`

| Code | Meaning                                                                |
| ---- | ---------------------------------------------------------------------- |
| 201  | A `track` object is successfully created. Returns: the `track` object. |
| 400  | Invalid track. 'Example: `to` must be after `from`'                    |
| 409  | A track already exists for id: `id`                                    |

A `201` also sends a `Location: /tracks/<id>` header pointing at the newly made track.

#### POST Request Body

This is the minimum accepted request.

```json
{
  "id": "nznx3r",
  "titles": { "primary": "AC/DC", "secondary": "Highway to Hell" },
  "availability": {
    "from": "2019-02-13T11:03:05Z",
    "to": "2019-03-15T11:00:00Z"
  }
}
```

A `201` responds with the full `track` object containing a server calculated `urn`, `type`, `label` and missing titles like `tertiary`.

```json
{
  "type": "track",
  "id": "nznx3r",
  "urn": "urn:bbc:sounds:track:nznx3r",
  "titles": {
    "primary": "AC/DC",
    "secondary": "Highway to Hell",
    "tertiary": null
  },
  "availability": {
    "from": "2019-02-13T11:03:05Z",
    "to": "2019-03-15T11:00:00Z",
    "label": "Available for 29 days"
  }
}
```

#### GET Response

A `200` returns the same track object as the `201` response.

### Errors

A `404` error returns:

```json
{
  "status": 404,
  "title": "Not Found",
  "detail": "No matching `track` found for that id `id`"
}
```

A `400` error returns with an `errors` list so our clients know which fields need fixing.

```json
{
  "status": 400,
  "title": "Invalid track",
  "detail": "The request body did not pass validation",
  "errors": [
    { "path": "availability.to", "message": "'to' must be after 'from'" }
  ]
}
```

A `409` error returns:

```json
{
  "status": 409,
  "title": "Conflict",
  "detail": "A track already exists for id: `id`"
}
```

These errors follow the shape set out by RFC 9457 which standardises error reporting for HTTP APIs.

## Design Decisions

- The codebase is split into three layers: routes handle HTTP, the service holds the business rules, and the repository stores tracks.
- Express only appears in `app.ts` and `tracks.routes.ts`, so moving to another framework means rewriting those two files.
- The service depends on the `TrackRepository` interface instead of the `TrackInMemoryRepository`. That will mean that adding another data source, like a database, requires writing a new class with the same two methods and passing it into `createApp`.
- The client supplies the track ID (assuming IDs are created upstream). I used POST instead of PUT because the brief asks to add tracks; PUT would replace an existing track, and overwriting one by accident is the worser mistake.
- The client owns the data and the server owns anything derived from it. The server sets `type`, `urn` and `label`. If the client sends a `urn`, it must match the ID. If they send a `label`, the server will ignore it and work out its own, so the label always matches the dates.
- The service throws domain errors (`TrackNotFoundError` and `TrackAlreadyExistsError`), and one error handler turns them into HTTP responses using the RFC 9457 format. Unexpected errors are logged and return a plain 500.
- Logs are structured JSON written with pino.
- On SIGTERM, the server stops taking new requests and finishes the ones in progress before shutting down. If they haven't finished after 10 seconds, it exits anyway.

## Details

- API should run on a localhost port
- Hold `track` objects in memory
- `GET` a track object by its ID
- `POST` a new track (with appropriate response and mindful HTTP methods/headers)
- A response when nothing is found
- A design to support another data source in the future

## Assumptions

These are easily reversible assumptions I have made to prioritise development rather than blocking on questions.

1. The `type` of a `track` object is always `"track"` and is set by the server.
2. The server generates a `urn` from the supplied `id`.
3. The `primary` field is required. `secondary` and `tertiary` are nullable and default to null.
4. The `label` is likely generated from `from` and `to`, and as whole days rounded down. In the example object, there are 29 days and just under 24 hours, which matches to "Available for 29 days".
5. The fields `from` and `to` are ISO 8601 UTC timestamps, and `to` must be after `from`.
6. `POST` accepts one track per request.
7. Any unknown fields should be rejected with a 400, so typos are surfaced.
8. A missing track should return a `404` with a JSON error body.

## Open Questions

- Should the label calculate days from `from`, or should it count days left from today?
- Should the `GET` request return a track outside its availability window?

## What should be added with more time

1. It definitely needs a DB to store the tracks so it persists and survives restarts. I'd move the duplicate check to a unique constraint to avoid race conditions.
2. There should be proper request IDs in the logging and any sensitive headers should be redacted.
3. We'd need to implement rate limiting on POST to avoid any abuse of the endpoint and we should authenticate users to prevent us receiving data from malicious actors.
4. Clients and users would make use of a `GET /tracks` endpoint with pagination and filters.
5. There should be metrics (latency and error rate to start) and a readiness check that tests our DB (once there is one).

## Packages

- [Express 5](https://expressjs.com/en/blog/2024-10-15-v5-release/): Widely known meaning other engineers likely know it and good ecosystem with many libraries
- [Zod](https://zod.dev/): Used to validate incoming data.
- [Pino & Pino-http](https://github.com/pinojs/pino-http): A high speed logger used to make structured logs.
- [Vitest](https://vitest.dev/): A Vite native testing framework. Can run TS.
