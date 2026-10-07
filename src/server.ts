import { createApp } from "./app.ts";

const port = Number(process.env.PORT ?? 3000);

createApp().listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
}); // for future reference change this to createApp(new DatabaseTrackRepository()) for switching from in-memory to a db repo
