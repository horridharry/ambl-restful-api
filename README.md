# AMBL Restful API

This is a small RESTful JSON API for adding and fetching AMBL's `track` objects.

## How to run the API

You need Node 24 or later.

```bash
npm ci            # clean install all packages.
npm run dev       # start on http://localhost:3000
npm test          # to run all tests
npm run check     # to run typecheck, lint, format and tests together
```

While server is running, use the curl commands below to test it out:

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

| Code | Meaning                                                                                            |
| ---- | -------------------------------------------------------------------------------------------------- |
| 201  | A `track` object is successfully created. Returns: the `track` object.                             |
| 400  | Invalid track. 'Example: The supplied `id` must be between 1 and 32 characters and letters/digits' |
| 409  | A track already exists for id: `id`                                                                |

A `201` also sends a `Location: /tracks/<id>` header pointing at the newly made track

#### POST Request Body

This is the minimum accepted request

```
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

```
{
  "type": "track",
  "id": "nznx3r",
  "urn": "urn:bbc:sounds:track:nznx3r",
  "titles": { "primary": "AC/DC", "secondary": "Highway to Hell", "tertiary": null },
  "availability": {
    "from": "2019-02-13T11:03:05Z",
    "to": "2019-03-15T11:00:00Z",
    "label": "Available for 29 days"
  }
}
```

#### GET Reponse

A `200` returns the same as above within the `201` response.

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
  "detail": "The request body failed validation",
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

## Details

- API should run on a localhost port
- Hold `track` objects in memory
- `GET` a track object by it's ID
- `POST` a new track (with appropriate response and mindful HTTP methods/headers)
- A response when nothing is found
- A design to support another data source in the future

## My assumptions

These are easily reversible assumptions I have made to priortise development rather than blocking on questions.

1. The `type` of a `track` object is always `"track"` and is set by the server.
2. The server generates a `urn` from the supplied `id`.
3. The `primary` field is required. `secondary` and `tertiary` are nullable and default to null.
4. The `label` is likely generated from `from` and `to`, and as whole days rounded down. In the example object, there is exactly 29 days and just under 24 hours, which matches to "Available for 29 days".
5. The fields `from` and `to` are ISO 8601 UTC timestamps, and `to` must be after `from`.
6. There is one track returned per `POST`.
7. Any unknown fields should be rejected with a 400, so typos are surfaced.
8. A missing track should return a 404 with a JSON error body, whilst a duplicate `POST` should probably return a 409 conflict error.

## Open questions

- Should the label calculate days from `from`, or should it count days left from today?
- Should the `GET` request return a track outside its availability window?

## What should be added with more time

1. It definitly needs a DB to store the tracks so it persists and survives restarts. I'd move the duplicate check to a unique constraint to avoid race conditions.
2. There should be more structured logging with request IDs on every line for more thorough obseravability.
3. We'd need to implement rate limiting on POST to avoid any abuse of the endpoint and we should authenticate users to prevent us recieveing data from malicious actors.
4. Clients and users would make use of a `GET /tracks` endpoint with pagination and filters.
5. There should be metrics (latency and error rate to start) and a readiness check thats tests our DB - if we had one

## Packages

- [Express 5](https://expressjs.com/en/blog/2024-10-15-v5-release/): Widely known meaning other engineers likely know it and good ecosystem with many libraries
- [Zod](https://zod.dev/): Used to validate incoming data.
- [Pino-http](https://github.com/pinojs/pino-http): A high speed logger used to make structured logs.
- [Vitest](https://vitest.dev/): A Vite native testing framework. Can run TS.
