import crypto from "node:crypto";
import { threadId } from "node:worker_threads";

console.log('Hello!! From Worker Thread.', threadId)
console.log(process.env.UV_THREADPOOL_SIZE);

for (let i = 0; i < 12; i++) {
  (async () => {
    crypto.pbkdf2(
      "secret",
      "salt",
      1_000_000,
      512,
      "sha512",
      (error, result) => {
        console.log("Hashed", i);
      }
    );
  })();
}
