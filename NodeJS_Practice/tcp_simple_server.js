const net = require("net");

const server = net.createServer((socket) => {
  console.log(
    `new Socket Connected with IPv4 -  ${socket.remoteAddress}:${socket.remotePort}`
  );

  // let i = 0;
  // setInterval(() => {
  //   socket.write(
  //     `PING from SERVER running on - ${socket.localAddress} : ${socket.localPort
  //     }`
  //   );
  //   // if (i++ === 5) {
  //   //   socket.end('End the Socket')
  //   // }
  // }, 2000);

  socket.on("data", (data) => {
    console.log(data.toString());
  });

  socket.on("close", () => {
    console.log("Socket Closed");
  });

  socket.on("error", ({ code: errorCode, message }) => {
    console.log(message);
  });
});

server.on('error', ({ code: errorCode, message }) => {
  console.log(message)
})

server.listen(3000, "localhost", () => {
  console.log("server is listening", server.address(), " PID : ", process.pid);

});
