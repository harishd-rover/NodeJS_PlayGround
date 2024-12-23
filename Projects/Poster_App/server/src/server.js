import MiniExpress from "../../lib/src/mini_express.js";

const app = new MiniExpress();

app.route("get", "/", (req, res) => {
  res.sendFile('../../public/index.html')
});

app.route("get", "/scripts.js", (req, res) => {
  res.sendFile('../../public/scripts.js')
});

app.route("get", "/styles.css", (req, res) => {
  res.sendFile('../../public/styles.css')
});

app.route("get", "/login", (req, res) => {
  res.json({ message: "wellcome to login" });
});

app.listen(3000, () => {
  console.log("Server listening on 3000");
});
