import { Worker, threadId } from "node:worker_threads";
import { resolve } from "node:path";

// SharedArrayBuffer and ArrayBuffer contains just raw binary data without any data representation.
// Just Raw binary data is meaningless without any data representation.
const sharedBuffer = new SharedArrayBuffer(6); // 6 bytes
// TypedArrays/DataViews/NodeJS_Buffers provides the Array representations for binary data in Javascript.
// DataTypes, Database Schema and Constraints, typedArrays, DataViews, MimeTypes in Files are used to represent the binary data.
// These representations will have their own data encoding and decoding alogorithms used to represent and store the binary data in memory/Disk.

const sharedArray = new Uint8Array(sharedBuffer); // reading binary data as Bytes array.

console.log("Before: ", sharedArray);

sharedArray[threadId] = 55;

var No_Workers = 6;

const __WorkerFile = resolve(
  import.meta.dirname,
  "../assets/shared_buffer.worker.js"
);

for (let i = 0; i < No_Workers; i++) {
  const worker = new Worker(__WorkerFile, { workerData: sharedArray.buffer });
}

setTimeout(() => {
  console.log("After: ", sharedArray);
}, 2000);
