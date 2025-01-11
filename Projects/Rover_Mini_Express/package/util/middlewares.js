/**
 * jsonBodyParser
 * middleware to parse the body from request
 * @param {req} req
 * @param {res} res
 * @param {next} next
 */
export async function jsonBodyParser(req, res, next) {
  let body = "";
  if (req.headers["content-type"] === "application/json") {
    req.setEncoding("utf-8");
    for await (const data of req) {
      body += data;
    }
  }
  req.body = JSON.parse(body || null); // this line will be executd only when async loop is done.
  next();
}

/**
 * cookiesParser
 * middleware to parse cookies from the request,
 * Cookies can be accessed from req.cookie Map
 * @param {req} req
 * @param {res} res
 * @param {next} next
 */
export function cookiesParser(req, res, next) {
  if (req.headers?.cookie) {
    req.cookies = new Map(
      req.headers.cookie.split(";").map((cookie) => [...cookie.split("=")])
    );
  } else {
    req.cookie = new Map();
  }
  next();
}

/**
 * urlParamsParser
 * middleware to parse URL Query Params from the request,
 * Query Params can be accessed from req.params Map.
 * @param {req} req
 * @param {res} res
 * @param {next} next
 */
export function urlParamsParser(req, res, next) {
  const queryParams = req.url.split("?")[1];
  req.params = new URLSearchParams(queryParams);
  next();
}
