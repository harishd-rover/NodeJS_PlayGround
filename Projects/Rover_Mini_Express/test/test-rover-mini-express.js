import MiniExpress from "rover-mini-express";
import { jsonBodyParser, cookiesParser } from "rover-mini-express/middlewares";
import StreamifyJSON from "rover-mini-express/streamify_json";
import { MIME_TYPES } from "rover-mini-express/mime_types";

const app = new MiniExpress();

app.setMiddleware(jsonBodyParser);

app.setMiddleware(cookiesParser);

app.route("get", "/api", (req, res) => {
  console.log("Cookies", req.cookies);

  const jsonStream = new StreamifyJSON(
    {
      message: "Hello from Rover Mini Express!!!",
      name: "Harish D",
      status: "Hey Its Working",
    },
    { highWaterMark: 10 },
    true,
    1000
  );

  jsonStream.pipe(res);
});

app.listen(2000, () => {
  console.log("--------------MimeTypes---------------------");
  console.log(MIME_TYPES);
  console.log("Server Listening on 2000");
});
