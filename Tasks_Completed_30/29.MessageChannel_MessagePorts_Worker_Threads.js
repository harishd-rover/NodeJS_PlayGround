//## Creating our own Message Channel and establishing the communication link by assigning the Message Ports to different threads to which we want to establish the Communication Channel.

import { Worker, MessageChannel } from "node:worker_threads";

const messageChannel = new MessageChannel();

const { port1: portForThread1, port2: portForThread2 } = messageChannel;

const thread1 = new Worker("../assets/thread1_task.js", {
  workerData: { mesagePort: portForThread1 },
  transferList: [portForThread1], // delegating the ownerShip of port1 to Thread1
});
const thread2 = new Worker("../assets/thread2_task.js", {
  workerData: { mesagePort: portForThread2 },
  transferList: [portForThread2], // delegating the ownerShip of port2 to Thread2
});

thread2.on("exit", (code) => {
  console.log("Thread1, thread2 Exited");
  console.log("Exiting Main Thread too.");
  process.exit(0);
});
