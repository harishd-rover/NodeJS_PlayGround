import * as fs from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";

const readStream = new Readable();
readStream._read = () => {
  console.log("read");
};

//* Pushing the Data to the Internal Buffer of the Readable Stream.
readStream.push(Buffer.from("harish"));
readStream.push(Buffer.from("harish"));
readStream.push(Buffer.from("harish"));
readStream.push(Buffer.from("harish"));
readStream.push(Buffer.from("Remaining Data"));
//* Reading the Data from the Internal Buffer.
console.log(readStream.read(12).toString()); // reading 12 bytes
console.log(readStream.read(12).toString()); // reading 12 bytes
console.log(readStream.read().toString()); // read all remaining
console.log(readStream.read()); // returns Null if no data available in internal Buffer

console.log("===============================================");

const timer = (value = "hello", time = 1000) =>
  new Promise((resolve) => setTimeout(() => resolve(value), time));

//* Lets create a Huge Buffer
let pathToImg = path.resolve(import.meta.dirname, "../assets/download.txt");
const imgBuffer = await fs.readFile(pathToImg);
console.log(imgBuffer);

//* const readStream = Readable.from(imgBuffer);
//* creates huge single chunk if we pass the buffer/data
class ReadableFromBuffer extends Readable {
  constructor(buffer) {
    super({ highWaterMark: 7 });
    this.buffer = buffer;
    this.bufferSize = buffer.byteLength;
    this.bytesRead = 0;
  }
  _construct(cb) {
    cb();
  }
  
  async _read(size) {
    if (this.bytesRead < this.bufferSize) {
      await timer();
      this.push(
        this.buffer.subarray(
          this.bytesRead,
          this.bytesRead + this.readableHighWaterMark
        )
      );
      this.bytesRead = this.bytesRead + this.readableHighWaterMark;
      console.log("Filled Internal Buffer");
    } else {
      this.push(null);
    }
    this.count++;
  }
}

const readStreamFromBuffer = new ReadableFromBuffer(imgBuffer);
console.log(readStreamFromBuffer.read());

// readStreamFromBuffer.on("data", (data) => {
//   console.log(data);
// });
