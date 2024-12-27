import MiniExpress from "../../lib/src/mini_express.js";
import { jsonBodyParser, cookiesParser } from "../../lib/src/middlewares.js";
import { posts, users } from "./model.data.js";
import { hugeJSON } from "./hugejson.js";
import StreamifyJSON from "../../lib/src/streamify_json.js";
import { pipeline } from "node:stream";
const AUTH_COOKIE = "posterAuth";

const app = new MiniExpress();

await app.serveStatic("../../public"); // serve static content

app.setMiddleware(jsonBodyParser); // json body parser middleware

app.setMiddleware(cookiesParser); // parse cookies from the request

// auth middleware
app.setMiddleware((req, res, next) => {
  if (req.url.startsWith("/api")) {
    const authToken = req.cookies?.get(AUTH_COOKIE);
    if (authToken) {
      const [username, password] = authToken.split("_");
      const currentUser = users.find(
        (user) => user.username === username && user.password === password
      );
      if (currentUser) {
        req.userId = currentUser.id;
      }
    }
  }
  next();
});

//? Actually This should not be a middleware.
//? it violates the middleware functionality.
app.setMiddleware(async (req, res, next) => {
  if (
    req.url === "/" ||
    req.url === "/login" ||
    req.url === "/profile" ||
    req.url === "/new-post"
  ) {
    await res.sendFile("../../public/index.html"); // Response is hanlded Here.
    // return next(false); // response handled on this middlewaare so don't navigate to next action. or
    return; // just return here, without calling next()
  }
  next();
});

app.route("get", "/api/posts", (req, res) => {
  res.status(200).json(
    posts.map((post) => ({
      ...post,
      author: users.find((user) => user.id == post.userId).name,
    }))
  );
});

// '/api/login' route
app.route("post", "/api/login", (req, res) => {
  const { username, password } = req.body;
  const currentUser = users.find((user) => user.username === username);
  if (!currentUser) {
    res.status(401).json({ error: "Invalid Username" });
    return;
  }

  if (currentUser.password !== password) {
    res.status(401).json({ error: "Invalid Password" });
    return;
  }

  res
    .setCookie(AUTH_COOKIE, `${currentUser.username}_${currentUser.password}`)
    .status(200)
    .json({ message: "Logged in!!!" });
});

app.route("get", "/api/user", (req, res) => {
  const currentUser = users.find((user) => user.id === req.userId);
  if (currentUser) {
    res.status(200).json(currentUser);
    return;
  }
  res.status(401).json({ error: "Invalid User, please login again" });
});

app.route("post", "/api/posts", async (req, res) => {
  const currentUser = users.find((user) => user.id === req.userId);
  if (!currentUser) {
    res.status(401).json({ error: "Invalid User, please login again" });
    return;
  }
  const { title: postTitle, body: postBody } = req.body;

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
  const currentUserIndex = users.findIndex((user) => user.id === req.userId);

  if (currentUserIndex >= 0) {
    const currentUser = users[currentUserIndex];

    const {
      name: modName,
      username: modUsername,
      password: modPassword,
    } = req.body;

    const modifiedUser = {
      ...currentUser,
      name: modName || currentUser.name,
      username: modUsername || currentUser.username,
      password: modPassword || currentUser.password,
    };

    users.splice(currentUserIndex, 1, modifiedUser);
    // change cookie
    return res
      .setCookie(
        AUTH_COOKIE,
        `${modifiedUser.username}_${modifiedUser.password}`
      )
      .status(200)
      .json({ updatedUser: modifiedUser });
  }

  res.status(401).json({ error: "Invalid User, please login again" });
});

app.route("delete", "/api/logout", (req, res) => {
  const currentUser = users.find((user) => user.id === req.userId);
  if (!currentUser) {
    res.status(401).json({ error: "Invalid User, please login again" });
    return;
  }
  res.removeCookie(AUTH_COOKIE).status(200).json({ message: "Logged Out" });
});

app.route("get", "/hugeJSONdownload", (req, res) => {
  // res.json(hugeJSON)

  // simulating 20kb delayed chunks and trigerring downlaod on client.
  const jsonReadStream = new StreamifyJSON(
    hugeJSON,
    { highWaterMark: 20_480 },
    true,
    false
  );

  res.download(`${Math.random() * 1000}.json`, jsonReadStream.jsonBufferLength);
  // Here we can understand the power of pipeline() when we cancel the download on client side.
  pipeline(jsonReadStream, res, (error) => {
    if (error) {
      console.log("Error : Download Stopped Unexpectedly!!!");
    } else {
      console.log("Sucess: Download Done!!!");
    }
  });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
