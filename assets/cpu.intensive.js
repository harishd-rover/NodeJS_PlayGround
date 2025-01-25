import crypto from "node:crypto";
import { threadId, workerData, parentPort } from "node:worker_threads";

console.log("I'm New Thread with ThreadId", threadId);
console.log("Env:MY_NAME : ", process.env.MY_NAME);
console.log("Env:UV_THREADPOOL_SIZE : ", process.env.UV_THREADPOOL_SIZE);
console.log("Args: ", process.argv);
console.log("Worker Data: ", workerData);

for (let i = 0; i < 4; i++) {
  crypto.pbkdf2("secret", "salt", 1_000_000, 512, "sha512", (error, result) => {
    console.log("Hashed", i);
  });
}

setInterval(() => {
  parentPort.postMessage("Hello From Worker Thread");
}, 2000);

parentPort.on("message", (message) => {
  console.log("Message on Worker Thread: ", message);
});

setTimeout(() => {
  process.exit(0); // Exit the Thread after 10 Sec
}, 20_000);
