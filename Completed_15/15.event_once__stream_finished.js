import * as events from "node:events";
import * as fs from "node:fs";
import * as path from "node:path";
import * as stream from "node:stream";

const pathToReadFile = path.join(import.meta.dirname, "../assets/read.txt");
const pathToWriteFile = path.join(import.meta.dirname, "../assets/write.txt");

const fileReadStream = fs.createReadStream(pathToReadFile);
const fileWriteStream = fs.createWriteStream(pathToWriteFile);

//! Using the events.once(eventEmitter, 'eventName') => Promise;

fileReadStream.pipe(fileWriteStream);

//* Alternative way to handle Readable 'end' event

// fileReadStream.on('end',()=>{
//   console.log('Reading Done')
// })

// (async () => {
//   await events.once(fileReadStream, "end");
//   console.log("Reading Done!!!");
// })();

stream.finished(fileReadStream, (error) => {
  if (error) {
    console.log(error.message);
  } else {
    console.log("Reading Done!!!");
  }
});

//* Alternative way to handle Writable 'finished' event

// fileWriteStream.on('finish', ()=>{
//   console.log('Writing Done')
// })

// (async () => {
//   await events.once(fileWriteStream, "finish");
//   console.log("Writing Finished!!!");
// })();

stream.finished(fileWriteStream, (error) => {
  if (error) {
    console.log(error.message);
  } else {
    console.log("Writing Finished!!!");
  }
});
