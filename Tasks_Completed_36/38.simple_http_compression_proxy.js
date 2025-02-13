import { createServer, request } from "node:http";
import { pipeline } from "node:stream/promises";
import { createGzip } from "node:zlib";

// Video Processor server
const mainServer = {
  hostname: "localhost",
  port: 3000,
};

const proxy = createServer();

proxy.on("request", async (proxy_req, proxy_res) => {
  const req = request({
    hostname: mainServer.hostname,
    port: mainServer.port,
    path: proxy_req.url,
    method: proxy_req.method,
    headers: proxy_req.headers,
  });

  req.on("response", async (res) => {
    const compressUrls = [
      "/",
      "/styles.css",
      "/scripts.js",
      "/api/user",
      "/api/videos",
    ];

    // compress the Response Body
    if (compressUrls.includes(proxy_req.url)) {
      if (req.getHeaders()["accept-encoding"].includes("gzip")) {
        proxy_res.setHeader("Content-Encoding", "gzip");
        proxy_res.setHeader("Transfer-Encoding", "chunked");

        proxy_res.writeHead(res.statusCode, res.statusMessage, res.headers);
        return pipeline(res, createGzip(), proxy_res);
      }
    }

    proxy_res.writeHead(res.statusCode, res.statusMessage, res.headers);
    await pipeline(res, proxy_res);
  });

  await pipeline(proxy_req, req);
});

proxy.listen(9000, "127.0.0.1", () => {
  console.log(
    "proxy server started on ",
    proxy.address().address,
    ":",
    proxy.address().port
  );
});
