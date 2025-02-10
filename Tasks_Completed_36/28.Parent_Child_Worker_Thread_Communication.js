import { Worker } from "node:worker_threads";

//## When we create/spawn new Worker Threads in Node. By Default The Message Channel is Established between Parent Thread and Child Worker Threads.
//## When we are dealing with Message Channels, then we NO need to deal with data serialization/deserialization. Node does everything.

const thread1 = new Worker("../assets/cpu.intensive.js", {
  argv: ["--name", "Harish"],
  env: {
    MY_NAME: "Harish",
    UV_THREADPOOL_SIZE: 12,
  },
  workerData: { name: "harish", age: 24 },
});

setInterval(() => {
  thread1.postMessage("Hello From Main Thread!!!");
}, 3000);

thread1.on("message", (message) => {
  console.log("Message on MainThread:", message);
});

thread1.on("exit", (code) => {
  console.log("Worker Thread Exited with Code", code);
  console.log("Exiting Main Thread too.");
  process.exit(0); // Exit the Main Thread.
});
