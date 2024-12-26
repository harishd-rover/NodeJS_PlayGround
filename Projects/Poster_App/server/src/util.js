export async function bodyFromRequest(req) {
  req.setEncoding("utf-8");
  let body = "";
  for await (const data of req) {
    body += data;
  }
  return JSON.parse(body); // this line will be executd only when async loop is done.
}

export function getCookieValue(rawCookies, key) {
  return (
    rawCookies
      ?.split(";")
      ?.find((cookie) => cookie.trim().startsWith(key + "="))
      ?.split("=")[1] ?? " _ "
  );
}
