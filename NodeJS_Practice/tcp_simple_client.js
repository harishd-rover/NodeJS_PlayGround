const net = require("net");

const clientSocket = net.createConnection({ host: "localhost", port: 3000 },
    () => {
        clientSocket.write(
            `PING from CLIENT : ${clientSocket.localAddress}:${clientSocket.localPort}`
        );

        // clientSocket.end('Client is closed !!!');

        console.log("clientSocket.localPort", clientSocket.localPort);
        console.log("clientSocket.remotePort", clientSocket.remotePort);

        clientSocket.on("data", (data) => {
            console.log(data.toString());
        });

        clientSocket.on("close", () => {
            console.log("Client Socket Closed");
        });
    }
);

clientSocket.on('error', ({ code: errorCode, address, port, message }) => {
    console.log(message);
})