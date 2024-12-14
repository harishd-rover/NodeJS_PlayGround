import * as http from "node:http";

const httpAgent = new http.Agent({
  keepAlive: true,
  timeout: 500,
  //* for other options use default settings,
  //* it's always recommended to use Global Agent
});

let i = 1;

const interval = setInterval(() => {
  if (i <= 40) {
    console.log("Sending Request ", i);
    exchange();
    i++;
  } else {
    clearInterval(interval);
  }
}, 400); //! greater than keep-alive timeout => each request will have separate socket connections => More Overhead.

function exchange() {
  const request = http.request({
    host: "localhost",
    port: 3000,
    path: "/login",
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    agent: httpAgent,
    //* Optional Agent,
    //* When we Don't specify a Agent. It will Use Global Agent with Default settings which uses keep-alive true.
    //* with best suitable settings
  });

  request.on("socket", () => {
    console.log("New Socket Connection Established!!!");
    request.socket.on("close", () => {
      console.log("Socket Connetion is closed!!!");
    });
  });

  request.end(
    JSON.stringify({
      username: "harish",
      password: "123",
    })
  );

  request.on("response", async (response) => {
    console.log("Responce Recieved!!!");
    console.log(response.statusCode, response.statusMessage);
    console.log(response.headers);

    const chunks = [];
    for await (const chunk of response) {
      chunks.push(chunk);
    }
    console.log("Response Body**************");
    console.log(Buffer.concat(chunks).toString());
  });
}

// console.log(http.STATUS_CODES);
// console.log(http.METHODS);
