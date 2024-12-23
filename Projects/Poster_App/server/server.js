import MiniExpress from "../lib/mini_express.js";

const app = new MiniExpress();

app.route("get", "/", (req, res) => {
  res.json({ message: "wellcome page" });
});

app.route("get", "/login", (req, res) => {
  res.json({ message: "wellcome to login" });
});

app.listen(3000, () => {
  console.log("Server listening on 3000");
});
