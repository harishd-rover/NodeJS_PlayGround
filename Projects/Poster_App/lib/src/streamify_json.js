// https://medium.com/@vaibhavmoradiya/how-to-implement-own-streams-in-node-js-edd9ab54a59b
import { Stream } from "node:stream";

const delay = (time = 300) =>
  new Promise((resolve) => setTimeout(resolve, time));

export default class StreamifyJSON extends Stream.Readable {
  _jsonObj = null;
  _jsonBuffer = null;
  _bytesRead = 0;
  _jsonBufferBytesLength = null;
  _noOfReads = 0;
  _simulateDelay = null;
  constructor(jsonObject, options, logging = false, simulateDelay = null) {
    super(options);
    this._jsonObj = jsonObject;
    this._logging = logging;
    this._simulateDelay = simulateDelay;

    this._jsonBuffer = Buffer.from(JSON.stringify(this._jsonObj));
    this._jsonBufferBytesLength = this._jsonBuffer.byteLength;
  }

  get jsonBufferLength() {
    return this._jsonBufferBytesLength;
  }

  _construct(cb) {
    // this._jsonBuffer = Buffer.from(JSON.stringify(this._jsonObj));
    // this._jsonBufferBytesLength = this._jsonBuffer.byteLength;
    cb();
  }

  async _read(size) {
    if (this._bytesRead < this._jsonBufferBytesLength) {
      if (this._logging) {
        console.log(
          "[",
          this._bytesRead,
          this._bytesRead + this.readableHighWaterMark,
          "]"
        );
        console.log("Filled Internal Buffer.", "Read:", ++this._noOfReads);
      }

      if (this._simulateDelay) {
        await delay(this._simulateDelay);
      }

      this.push(
        //? subarray:- The begin offset is inclusive and the end offset is exclusive.
        this._jsonBuffer?.subarray(
          this._bytesRead,
          this._bytesRead + this.readableHighWaterMark
        )
      );
      this._bytesRead = this._bytesRead + this.readableHighWaterMark;
    } else {
      if (this._logging) {
        console.log("Stream Ended with", this._noOfReads, "chunks.");
      }
      this.push(null); // ending the stream.
    }
  }
  _destroy(error, cb) {
    this._bytesRead = 0;
    this._jsonBuffer = null;
    this._jsonBufferBytesLength = null;
    this._noOfReads = 0;
    if (this._logging) {
      console.log("Stream Destroyed");
    }
    cb();
  }
}
