import { workerData } from "node:worker_threads";
console.log("Welcome to Thread 2!!!");
const messagePort = workerData.mesagePort;

messagePort.on("message", (message) => {
  console.log("message on thread2 : ", message);
  if (message === "EXIT") {
    console.log("Thread 2 Exits");
    setTimeout(() => {
      process.exit(0);
    }, 100);
  }
});

setInterval(() => {
  messagePort.postMessage("ping from thread2");
}, 2000);
