//# Synchronization
//## it is the process of organizing the concurrent threads to safely access the shared resources and critical sections to achieve the data consistency by preventing the race conditions in multi-threaded environment by using Atomics and Mutual Exclusion Techniques.

//## Race conditions happens bcz of Concurrency and Paralellism of CPU.

//## Concurrency => CPU context switching and HyperThreading.
//## Parallelism => Multi-Core CPUs

import { Worker, threadId } from "node:worker_threads";
import { resolve } from "node:path";

const sharedBuffer = new SharedArrayBuffer(4); // 8 * 4 = 32 Bit

const sharedArray = new Uint32Array(sharedBuffer);
// reading binary data as 32bit Unsigned Integer array.
// => Each Element => (0 to 2^32).
// here it has only 1 element in array.

const lock = new Int32Array(new SharedArrayBuffer(4));
// using typedArray Int32Array bcz Atomics.wait() and Atomics.notify() only works with Int32Array / BigInt64Array.

console.log("Before: ", sharedArray);

var No_Workers = 6;

const __SpinLockWorkerFile = resolve(
  import.meta.dirname,
  "34.synchronization.spin-lock.worker.js"
);

const __MutexWorkerFile = resolve(
  import.meta.dirname,
  "35.synchronization.mutex-binary-semaphore.worker.js"
);

const __MutexWithDeadLockWorkerFile = resolve(
  import.meta.dirname,
  "36.dead-lock.serial.worker.js"
);

let completed = 0;

for (let i = 0; i < No_Workers; i++) {
  const worker = new Worker(__MutexWithDeadLockWorkerFile, {
    workerData: {
      data: sharedArray.buffer,
      lock: lock.buffer,
    },
  });

  worker.on("exit", () => {
    completed++;
    if (completed === No_Workers) {
      console.log("After :", sharedArray);
    }
  });
}
