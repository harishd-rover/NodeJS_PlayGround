import MiniExpress from "../../lib/src/mini_express.js";

const app = new MiniExpress();

await app.serveStatic("../../public");

app.route("get", "/", (req, res) => {
  res.sendFile("../../public/index.html");
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
