import * as fs from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";

// Lets create a Huge Buffer
let pathToImg = path.resolve(import.meta.dirname, "../assets/upload.jpg");

const imgBuffer = await fs.readFile(pathToImg);
// console.log(imgBuffer);

//* const readStream = Readable.from(imgBuffer);
//* creates huge single chunk if we pass the buffer/data
//* if we pass asynIterator/ayncGenerator it creates proper stream.

class ReadableFromBuffer extends Readable {
  constructor(hugeBuffer = null, sizeToRead = 0) {
    super({highWaterMark:2});
    this.hugeBuffer = hugeBuffer;
    this.sizeToRead = sizeToRead;
  }

  _construct(cb) {
    this.push("harish");
    this.push("harish");
    this.push("harish");
    this.push("harish");
    cb();
  }
  _read(size) {
    console.log("read");
  }
}

const readStream = new ReadableFromBuffer().read();
// readStream.on("data", (data) => {
//   console.log("d", data);
// });
