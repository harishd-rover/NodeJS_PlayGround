import http from "node:http"; // Default exports
import websocket from "websocket";

// creating a http server object.
const httpServer = http.createServer();

// configuring http server for websocket communication.
const wsConfiguredServer = new websocket.server({ httpServer });

wsConfiguredServer.on("request", (req) => {
  let intervalID,
    i = 1;
  console.log(`Client with key ${req.key} is Connected`);
  const connection = req.accept(null, req.origin);
  if (connection) {
    connection.on("message", (data) => {
      console.log("Msg From Client", data.utf8Data);
    });

    connection.on("close", (code, desc) => {
      console.log("Connection Closed with key ", req.key);
      clearInterval(intervalID);
    });

    intervalID = setInterval(() => {
      connection.send(`PING ${i++} from Server!!!`);
    }, 2000);
  }
});

httpServer.listen(3000, () => {
  console.log("server listening on: ", httpServer.address());
});
