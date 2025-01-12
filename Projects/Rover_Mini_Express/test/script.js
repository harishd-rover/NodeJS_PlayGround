import MiniExpress, {
  jsonBodyParser,
  cookiesParser,
  urlParamsParser,
  StreamifyJSON,
  mime_types,
} from "rover-mini-express";

// import MiniExpress from "rover-mini-express";
// import {
//   jsonBodyParser,
//   cookiesParser,
//   urlParamsParser,
// } from "rover-mini-express/middlewares";
// import StreamifyJSON from "rover-mini-express/streamify_json";
// import { MIME_TYPES } from "rover-mini-express/mime_types";

const app = new MiniExpress();

app.setMiddleware(jsonBodyParser);

app.setMiddleware(urlParamsParser);

app.setMiddleware(cookiesParser);

app.setErrorHandler((error, req, res) => {
  // Do something with errors at one place
  console.log("Error: ", error);
  res
    .status(error?.status ?? 500)
    .json({ testAppError: error?.error ?? "Test App Error" });
});

app.route("get", "/api", (req, res, handleError) => {
  console.log("Cookies: ", req.cookies);

  console.log("QueryParams: ", [...req.params.entries()]);

  if (req.params.get("error")) {
    return handleError({ status: 501, error: "My Route Error" });
  }

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
  console.log(mime_types);
  console.log("Server Listening on 2000");
});
