import { workerData, threadId, parentPort } from "node:worker_threads";

const sharedArrayBuffer = workerData;
const sharedArray = new Uint32Array(sharedArrayBuffer);

const count = 10_000_000;

for (let i = 0; i < count; i++) {
  // sharedArray[0] = sharedArray[0] + 1;  // With Race condtion
  Atomics.add(sharedArray, 0, 1); // Without Race condtion
}
