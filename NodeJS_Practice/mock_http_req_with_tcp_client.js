// ***  Running simple Http Server And Sending Mock Http Request From Tcp CLient to Actual Http Server.

const net = require("net");

const clientSocket = net.createConnection(
  { host: "localhost", port: 3000 },
  () => {
    let chunks = [];

    // Getting Response
    clientSocket.on("data", (chunk) => {
      chunks.push(chunk);
    });

    clientSocket.on("end", () => {
      console.log(
        "HTTP Response from Http Server ==================================="
      );
      console.log(Buffer.concat(chunks).toString());
    });

    // Sending Mocked Http Request Message
    clientSocket.end(
      Buffer.from(
        "504f5354202f6c6f67696e20485454502f312e310d0a636f6e74656e742d6c656e6774683a2034370d0a6163636570742d656e636f64696e673a20677a69702c206465666c6174652c2062720d0a4163636570743a202a2f2a0d0a557365722d4167656e743a205468756e64657220436c69656e74202868747470733a2f2f7777772e7468756e646572636c69656e742e636f6d290d0a436f6e6e656374696f6e3a20636c6f73650d0a436f6e74656e742d547970653a206170706c69636174696f6e2f6a736f6e0d0a486f73743a206c6f63616c686f73743a333030300d0a0d0a7b0a202022757365726e616d65223a2022686172697368222c0a20202270617373776f7264223a2022313233220a7d",
        "hex"
      )
    );

    clientSocket.on("close", () => {
      console.log("Client Socket Closed");
    });
  }
);

clientSocket.on("error", ({ code: errorCode, address, port, message }) => {
  console.log(message);
});
