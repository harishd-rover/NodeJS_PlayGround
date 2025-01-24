import crypto from "node:crypto";

import { promisify } from "node:util";
const promifiedPbkdf2 = promisify(crypto.pbkdf2);

//* Crypto Operations are CPU Intensive Tasks.

////***************** Using Single Main Thread **************************************/
//## Running One task at a time.
//## Synchronous. It's using single main thread.
//## No UV_THREAD_POOL involved here.
//## using only 1 core cpu time/utilization.
//## CPU usage 8% (win) 0r 100% (unix). 1 CPU Core utilization.

// for (let i = 0; i < 12; i++) {
//   const result = crypto.pbkdf2Sync("secret", "salt", 1_000_000, 512, "sha512");
//   console.log(result);
// }

//## Promise Version, Still Running Synchronously.

// for (let i = 0; i < 12; i++) {
//   const result = await promifiedPbkdf2(
//     "secret",
//     "salt",
//     1_000_000,
//     512,
//     "sha512"
//   );
//   // console.log(result);
//   console.log("Hashed", i);
// }

////**************** using default LibUV Thread Pool Size. i.e. 4. ********************/
//? ==>  node 26.UV_THREADPOOL_SIZE_CPU_Intensive.js
//## Asynchronous, it's using UV_THREAD_POOL.
//## Here By Default LibUV have 4 threads in it's UV_THREAD_POOL.
//## Using 4 cpu core utilization.
//## 4 concurrent tasks at once.
//## CPU usage 32% (win) 400% (unix). 4 CPU cores utilization.

// for (let i = 0; i < 12; i++) {
//   (async () => {
//     crypto.pbkdf2(
//       "secret",
//       "salt",
//       1_000_000,
//       512,
//       "sha512",
//       (error, result) => {
//         console.log("Hashed", i);
//       }
//     );
//   })();
// }

//## Promise Version

// for (let i = 0; i < 12; i++) {
//   (async () => {
//     const result = await promifiedPbkdf2(
//       "secret",
//       "salt",
//       1_000_000,
//       512,
//       "sha512"
//     );
//     // console.log(result);
//     console.log("Hashed", i);
//   })();
// }

////********************* Setting LibUV Thread Pool Size to 12. ***********************/
//? ==>  SET UV_THREADPOOL_SIZE=12 && node 26.UV_THREADPOOL_SIZE_CPU_Intensive.js
//## Asynchronous, it's using UV_THREAD_POOL.
//## Increased Libuv Thread pool Size to 12.
//## Here LibUV have 12 threads in it's UV_THREAD_POOL.
//## 12 concurrent tasks at once.
//## CPU usage 100% (win) 1200% (unix). 12 CPU cores utilization.

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
