import MiniExpress from "../../lib/src/mini_express.js";

const app = new MiniExpress();

await app.serveStatic("../../public");

app.route("get", "/", (req, res) => {
  res.sendFile("../../public/index.html");
});

app.setMiddleWare((req, res, next) => {
  console.log("middlewaare 1 executed");
  next();
});

app.setMiddleWare((req, res, next) => {
  setTimeout(() => {
    console.log("middlewaare 2 executed");
    next();
  }, 2000);
});

app.setMiddleWare((req, res, next) => {
  setTimeout(() => {
    console.log("middlewaare 3 executed");
    next();
  }, 3000);
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
