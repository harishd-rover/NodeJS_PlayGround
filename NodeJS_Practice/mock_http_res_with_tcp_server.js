//**** Will get actual http request from  Actual HttpClient and will send Mocked HttpResponse from TCP Server to Actual Http Client(thunderbolt).

const net = require("net");

const server = net.createServer((socket) => {
  console.log(
    `new Socket Connected with IPv4 -  ${socket.remoteAddress}:${socket.remotePort}`
  );

  let chunks = [];

  socket.on("data", (chunk) => {
    chunks.push(chunk);
    // Writing the buffer that contains Mocked Http Response message
    socket.end(
      Buffer.from(
        "485454502f312e3120323030204f4b0d0a436f6e74656e742d547970653a206170706c69636174696f6e2f6a736f6e0d0a446174653a204672692c2031332044656320323032342030373a33303a353620474d540d0a436f6e6e656374696f6e3a20636c6f73650d0a436f6e74656e742d4c656e6774683a2034310d0a0d0a7b22757365726e616d65223a22686172697368222c22737461747573223a224c6f67676564496e227d",
        "hex"
      )
    );
  });

  socket.on("end", () => {
    console.log("HTTP Request Message===================================");
    console.log(Buffer.concat(chunks).toString());
  });

  socket.on("error", ({ code: errorCode, message }) => {
    console.log(message);
  });
});

server.on("error", ({ code: errorCode, message }) => {
  console.log(message);
});

server.listen(3000, "localhost", () => {
  console.log("server is listening", server.address(), " PID : ", process.pid);
});
