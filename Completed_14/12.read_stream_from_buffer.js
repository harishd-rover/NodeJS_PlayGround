import * as fs from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";

const timer = (value = "hello", time = 1000) =>
  new Promise((resolve) => setTimeout(() => resolve(value), time));

const readStream = new Readable();
readStream._read = () => {
  console.log("read");
};

//* Pushing the Data to the Internal Buffer of the Readable Stream before reading the stream.
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










//* Lets create a Huge Buffer from a File*********************************************

let pathToFile = path.resolve(import.meta.dirname, "../assets/download.txt");
const hugeBuffer = await fs.readFile(pathToFile);

//const readStream = Readable.from(hugeBuffer); //* it creates huge single chunk, if we pass the buffer/data.

//* Creating the Custom ReadableStream to stream the Huge Buffer in chunks.
class ReadableFromBuffer extends Readable {
  constructor(inputBuffer) {
    super({ highWaterMark: 7 });
    this.inputBuffer = inputBuffer;
    this.inputBufferSize = inputBuffer.byteLength;
    this.bytesRead = 0;
  }
  _construct(cb) {
    cb();
  }

  async _read(size) {
    if (this.bytesRead < this.inputBufferSize) {
      await timer();
      console.log(
        "[",
        this.bytesRead,
        this.bytesRead + this.readableHighWaterMark,
        "]"
      );
      console.log("Filled Internal Buffer after a secand");
      this.push(
        this.inputBuffer.subarray(
          this.bytesRead,
          this.bytesRead + this.readableHighWaterMark
        )
      );
      this.bytesRead = this.bytesRead + this.readableHighWaterMark;
    } else {
      this.push(null); // ending the stream.
    }
  }
}

const readStreamFromBuffer = new ReadableFromBuffer(hugeBuffer);

//************ reading the ReadStream using .read() **********************/

//? Stream.read() => it reads the internal buffer first and calls the _read() method of the stream to fill the internal buffer and exits, as noone is listening to the data events. and as the stream is not in flowing state.

//? console.log(readStreamFromBuffer.read()); ==> null
//? it returns null in first stream.read() call as internal buffer is empty at that time.

//! when we call the read() method synchronously and repeatedly , the _read() won't get enough CPU time to fill the internal buffer (as main thread is blocked)

//! when we call the stream.on('data'), stream.pipe(), (for...await of)  -> readStream gets into flowing Mode. These are all kind of asynchronous handlers. so _read() will get enough CPU Time there.

//? calling stream.read() ==> Reads the internal buffer first and calls _read() to fill the internal buffer for next stream.read() call.

//? we can demonstrate the same below.
readStreamFromBuffer.read(); //? reading internal buffer first it calls the _read() method to fill the internal buffer for next read.
setTimeout(() => {
  // Giving the enough CPU Time to (_read()) / to refill the internal buffer by using intervals and timers or by mocking Asynchronacy.
  let i = 1;
  const interval = setInterval(() => {
    const data = readStreamFromBuffer.read();
    if (data) console.log(i++, data.toString());
    // if data available, print it. else stop reading.
    else clearInterval(interval); // once the stream is ended, stop reading.
  }, 1000);
}, 1100); // after 1 secand, data is available in the internal buffer.

//* Using the 'data' event to read the Stream

// readStreamFromBuffer.on("data", (data) => {
//   console.log(i++,data.toString());
// });

//* using for...await of loop.
// let i = 1;
// readStreamFromBuffer.setEncoding("utf-8");
// for await (const data of readStreamFromBuffer) {
//   console.log(i++, data);
// }
