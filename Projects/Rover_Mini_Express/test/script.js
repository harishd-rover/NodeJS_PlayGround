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

const app = new MiniExpress();

app.setMiddleware(jsonBodyParser);

app.setMiddleware(urlParamsParser);

app.setMiddleware(cookiesParser);

app.route("get", "/api", (req, res) => {
  console.log("Cookies: ", req.cookies);

  console.log("QueryParams: ", [...req.params.entries()]);

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
