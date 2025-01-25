import { workerData } from "node:worker_threads";
console.log("Welcome to Thread 1!!!");

const messagePort = workerData.mesagePort;

messagePort.on("message", (message) => {
  console.log("message on thread1 : ", message);
});

setInterval(() => {
  messagePort.postMessage("ping from thread1");
}, 3000);

setTimeout(() => {
  console.log("Thread 1 Exits");
  messagePort.postMessage("EXIT");
  process.exit(0);
}, 10000);
