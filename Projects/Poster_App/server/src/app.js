import MiniExpress from "../../lib/src/mini_express.js";
import { jsonBodyParser, cookiesParser } from "../../lib/src/middlewares.js";
import { hugeJSON } from "./hugejson.js";
import StreamifyJSON from "../../lib/src/streamify_json.js";
import { pipeline } from "node:stream";
import * as dataService from "./data.service.js";
const AUTH_COOKIE = "posterAuth";

const app = new MiniExpress();

await app.serveStatic("../../public"); // serve static content

app.setMiddleware(jsonBodyParser); // json body parser middleware

app.setMiddleware(cookiesParser); // parse cookies from the request

// auth middleware
app.setMiddleware((req, res, next) => {
  if (
    req.url.startsWith("/api") &&
    !(req.url === "/api/login") &&
    !(req.url === "/api/posts" && req.method === "GET")
  ) {
    const authToken = req.cookies?.get(AUTH_COOKIE);
    if (authToken) {
      const [username, password] = extractToken(authToken);
      const validUser = dataService.validateUser(username, password);

      if (validUser) {
        req.userId = validUser.id;
        return next();
      } else {
        return res
          .status(401)
          .json({ error: "Invalid User, please login again" });
      }
    } else {
      return res
        .status(401)
        .json({ error: "Invalid User, please login again" });
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
  const posts = dataService.getAllPosts();
  res.status(200).json(posts);
});

// '/api/login' route
app.route("post", "/api/login", (req, res) => {
  const { username, password } = req.body;
  const currentUser = dataService.getUserFromUserName(username);
  if (!currentUser) {
    res.status(401).json({ error: "Invalid Username" });
    return;
  }
  if (currentUser.password !== password) {
    res.status(401).json({ error: "Invalid Password" });
    return;
  }
  const authToken = createToken(currentUser.username, currentUser.password);
  res
    .setCookie(AUTH_COOKIE, authToken)
    .status(200)
    .json({ message: "Logged in!!!" });
});

app.route("get", "/api/user", (req, res) => {
  const currentUser = dataService.getUser(req.userId);
  res.status(200).json(currentUser);
});

app.route("post", "/api/posts", async (req, res) => {
  const newPost = dataService.createPost(
    req.userId,
    req.body.title,
    req.body.body
  );
  res.status(200).json(newPost);
});

app.route("put", "/api/user", async (req, res) => {
  const modifiedUser = dataService.updateUser(
    req.userId,
    req.body.name,
    req.body.username,
    req.body.password
  );
  // update cookie
  const newToken = createToken(modifiedUser.username, modifiedUser.password);

  return res
    .setCookie(AUTH_COOKIE, newToken)
    .status(200)
    .json({ updatedUser: modifiedUser });
});

app.route("delete", "/api/logout", (req, res) => {
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

function createToken(...args) {
  return args.join("_");
}

function extractToken(token) {
  return token.split("_");
}
