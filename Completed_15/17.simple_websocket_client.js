// Creating the wsClient using WebSocket API.(Browser's Native)
const webSocketClient = new WebSocket("ws://localhost:3000");

let intervalID;
webSocketClient.onopen = () => {
  let i = 1;
  intervalID = setInterval(() => {
    if (i <= 10) {
      webSocketClient.send(`Hi ${i++} Time From Client`);
    } else {
      webSocketClient.close(); // closing the websocket
    }
  }, 1500);
};

webSocketClient.onmessage = (message) => {
  console.log(message.data);
};

webSocketClient.onclose = () => {
  console.log("Connection Closed");
  clearInterval(intervalID);
};
