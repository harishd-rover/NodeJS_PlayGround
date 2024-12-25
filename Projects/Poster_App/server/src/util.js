export async function bodyFromRequest(req) {
  req.setEncoding("utf-8");
  let body = "";
  for await (const data of req) {
    body += data;
  }
  return JSON.parse(body);
}
