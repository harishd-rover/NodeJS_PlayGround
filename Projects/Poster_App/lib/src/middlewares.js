/**
 * jsonBodyParser
 * middleware to parse the body from request
 * @param {req} req
 * @param {res} res
 * @param {next} next
 */
export async function jsonBodyParser(req, res, next) {
  let body = '';
  if (req.headers["content-type"] === "application/json") {
    req.setEncoding("utf-8");
    for await (const data of req) {
      body += data;
    }
  }
  req.body = JSON.parse(body || null); // this line will be executd only when async loop is done.
  next();
}
