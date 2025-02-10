import { Worker, threadId } from "node:worker_threads";
import { resolve } from "node:path";

//# Synchronization
//## it is the process of organizing the concurrent threads to safely access the shared resources and critical sections to achieve the data consistency by preventing the race conditions in multi-threaded environment by using Atomics and Mutual Exclusion Techniques.

//## Race conditions happens bcz of Concurrency and Paralellism of CPU.

//* Concurrency => CPU context switching and HyperThreading.
//* Parallelism => Multi-Core CPUs

const sharedBuffer = new SharedArrayBuffer(4); // 8 * 4 = 32 Bit

const sharedArray = new Uint32Array(sharedBuffer);
// reading binary data as 32bit Unsigned Integer array.
// => Each Element => (0 to 2^32).
// here it has only 1 element in array.

console.log("Before: ", sharedArray);

var No_Workers = 6;

const __WorkerFile = resolve(
  import.meta.dirname,
  "34.synchronization.worker.js"
);

let completed = 0;

for (let i = 0; i < No_Workers; i++) {
  const worker = new Worker(__WorkerFile, { workerData: sharedArray.buffer });

  worker.on("exit", () => {
    completed++;
    if (completed === No_Workers) {
      console.log("After :", sharedArray);
    }
  });
}
