import MiniExpress from "../../lib/src/mini_express.js";
import { jsonBodyParser } from "../../lib/src/middlewares.js";

const app = new MiniExpress();

await app.serveStatic("../../public"); // serve static content

// serve index.html
app.route("get", "/", (req, res) => {
  res.sendFile("../../public/index.html");
});

// // testing middleware
// app.setMiddleware((req, res, next) => {
//   console.log("middlewaare 1 executed");
//   next();
// });

// // testing middleware
// app.setMiddleware((req, res, next) => {
//   setTimeout(() => {
//     console.log("middlewaare 2 executed");
//     next();
//   }, 2000);
// });

app.setMiddleware(jsonBodyParser); // json body parser middleware

// '/api/login' route
app.route("post", "/api/login", (req, res) => {
  console.log(req.body);
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
