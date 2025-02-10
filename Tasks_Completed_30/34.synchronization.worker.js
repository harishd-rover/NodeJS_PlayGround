import { workerData, threadId, parentPort } from "node:worker_threads";

const sharedArrayBuffer = workerData;
const sharedArray = new Uint32Array(sharedArrayBuffer);

const count = 10_000_000;

for (let i = 0; i < count; i++) {
  // sharedArray[0] = sharedArray[0] + 1;  // With Race condtion
  //## Eliminating race condition by using Atomics.
  //## We have only simple operations in Atomics.
  Atomics.add(sharedArray, 0, 1);
}
