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
