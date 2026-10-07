# AMBL Restful API

This is a small RESTful JSON API for adding and fetching AMBL's `track` objects.

## How to run the API

### Requirements

- You need Node 24 or later.

### Instructions

- Run `npm ci` to clean install all packages.
- Run `npm run dev` to start on http://localhost:3000
- Run `npm test` to run all tests
- Run `npm run check` to run typecheck, lint, format and tests together

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

## Packages

- [Express 5](https://expressjs.com/en/blog/2024-10-15-v5-release/): Widely known meaning other engineers likely know it and good ecosystem with many libraries
- [Zod](https://zod.dev/): Used to validate incoming data.
- [Pino-http](https://github.com/pinojs/pino-http): A high speed logger used to make structured logs.
- [Vitest](https://vitest.dev/): A Vite native testing framework. Can run TS.
