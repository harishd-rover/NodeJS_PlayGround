import http from "node:http";

const myServers = [
  { host: "localhost", port: 3000 },
  { host: "localhost", port: 4000 },
];

const httpProxy = http.createServer((proxyReq, proxyRes) => {
  // RoundRobin
  const targetServer = myServers.shift();
  myServers.push(targetServer);

  const serverReq = http.request(
    {
      host: targetServer.host,
      port: targetServer.port,
      method: proxyReq.method,
      path: proxyReq.url,
      headers: proxyReq.headers,
    },
    (serverRes) => {
      proxyRes.writeHead(
        serverRes.statusCode,
        serverRes.statusMessage,
        serverRes.headers
      );
      serverRes.pipe(proxyRes);
    }
  );
  proxyReq.pipe(serverReq);
});

httpProxy.listen(5000, () => {
  console.log("HTTP Proxy Listening on 5000");
});
