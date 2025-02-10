import { workerData, threadId, parentPort } from "node:worker_threads";

const sharedArrayBuffer = workerData;
const sharedArray = new Uint8Array(sharedArrayBuffer);

sharedArray[threadId] = 55;
