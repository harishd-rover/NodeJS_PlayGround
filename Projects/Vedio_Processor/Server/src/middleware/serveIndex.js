import path from "node:path";
const serveHTML = async (req, res, next) => {
  if (
    req.url === "/" ||
    req.url === "/login" ||
    req.url === "/profile" ||
    req.url === "/new-post"
  ) {
    await res.sendFile(path.resolve(import.meta.dirname, '../../public/index.html')); // Response is hanlded Here.
    // return next(false); // response handled on this middlewaare so don't navigate to next action. or
    return; // just return here, without calling next()
  }
  next();
};

export { serveHTML as serveIndex };
