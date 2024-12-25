import MiniExpress from "../../lib/src/mini_express.js";
import { posts, users } from "./model.data.js";
import { bodyFromRequest, getCookieValue } from "./util.js";

const app = new MiniExpress();
const AUTH_COOKIE = "posterAuth";

app.route("get", "/", (req, res) => {
  res.sendFile("../../public/index.html");
});
app.route("get", "/login", (req, res) => {
  res.sendFile("../../public/index.html");
});
app.route("get", "/profile", (req, res) => {
  res.sendFile("../../public/index.html");
});
app.route("get", "/new-post", (req, res) => {
  res.sendFile("../../public/index.html");
});

app.route("get", "/scripts.js", (req, res) => {
  res.sendFile("../../public/scripts.js");
});

app.route("get", "/styles.css", (req, res) => {
  res.sendFile("../../public/styles.css");
});

app.route("post", "/api/login", async (req, res) => {
  const { username, password } = await bodyFromRequest(req);

  const currentUser = users.find((user) => user.username === username);

  if (!currentUser) {
    res.status(401).json({ error: "Invalid Username" });
    return;
  }

  if (currentUser.password !== password) {
    res.status(401).json({ error: "Invalid Password" });
    return;
  }

  res.setHeader(
    "Set-Cookie",
    `posterAuth=${currentUser.username}_${currentUser.password};httpOnly;`
  );

  res.status(200).json({ message: "Logged in!!!" });
});

app.route("get", "/api/posts", (req, res) => {
  res.status(200).json(
    posts.map((post) => ({
      ...post,
      author: users.find((user) => user.id == post.userId).name,
    }))
  );
});

app.route("get", "/api/user", (req, res) => {
  const [username, password] = getCookieValue(
    req.headers.cookie,
    AUTH_COOKIE
  )?.split("_");

  const currentUser = users.find(
    (user) => user.username === username && user.password === password
  );

  if (currentUser) {
    res.status(200).json(currentUser);
    return;
  }

  res.status(401).json({ error: "UnAuthorized User. Login again" });
});

app.route("delete", "/api/logout", (req, res) => {
  const [username, password] = getCookieValue(
    req.headers.cookie,
    AUTH_COOKIE
  )?.split("_");

  const currentUser = users.find(
    (user) => user.username === username && user.password === password
  );

  if (!currentUser) {
    res.status(401).json({ error: "Login Error, please login again" });
    return;
  }

  res.setHeader("Set-Cookie", `posterAuth=;Max-Age=0`);
  res.status(200).json({ message: "Logged Out" });
});

app.route("post", "/api/posts", async (req, res) => {
  const [username, password] = getCookieValue(
    req.headers.cookie,
    AUTH_COOKIE
  )?.split("_");

  const currentUser = users.find(
    (user) => user.username === username && user.password === password
  );

  if (!currentUser) {
    res.status(401).json({ error: "Login Error, please login again" });
    return;
  }

  const { title: postTitle, body: postBody } = await bodyFromRequest(req);

  posts.unshift({
    id: Math.random(),
    title: postTitle,
    body: postBody,
    userId: currentUser.id,
  });

  res.status(200).json({
    id: Math.random(),
    title: postTitle,
    body: postBody,
    userId: currentUser.id,
  });
});

app.route("put", "/api/user", async (req, res) => {
  const [username, password] = getCookieValue(
    req.headers.cookie,
    AUTH_COOKIE
  )?.split("_");

  const currentUserIndex = users.findIndex(
    (user) => user.username === username && user.password === password
  );

  if (currentUserIndex >= 0) {
    const currentUser = users[currentUserIndex];

    const {
      name: modName,
      username: modUsername,
      password: modPassword,
    } = await bodyFromRequest(req);

    const modifiedUser = {
      ...currentUser,
      name: modName || currentUser.name,
      username: modUsername || currentUser.username,
      password: modPassword || currentUser.password,
    };

    users.splice(currentUserIndex, 1, modifiedUser);
    // change cookie
    res.setHeader(
      "Set-Cookie",
      `posterAuth=${modifiedUser.username}_${modifiedUser.password};httpOnly;`
    );
    res.status(200).json({ updatedUser: modifiedUser });
    return;
  }

  res.status(401).json({ error: "Invalid User, please login again" });
});

app.listen(process.env.PORT ?? 3000, () => {
  console.log("Server listening on", process.env.PORT ?? 3000);
});
