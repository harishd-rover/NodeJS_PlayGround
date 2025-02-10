import * as events from "node:events";
import * as fs from "node:fs";
import * as path from "node:path";
import * as stream from "node:stream";

const pathToReadFile = path.join(import.meta.dirname, "../assets/read.txt");
const pathToWriteFile = path.join(import.meta.dirname, "../assets/write.txt");

const fileReadStreamCumEventEmitter = fs.createReadStream(pathToReadFile);
const fileWriteStreamCumEventEmitter = fs.createWriteStream(pathToWriteFile);

//! Using the events.once(eventEmitter, 'eventName') => Promise;

fileReadStreamCumEventEmitter.pipe(fileWriteStreamCumEventEmitter);

//* Alternative way to handle Readable 'end' event

// fileReadStreamCumEventEmitter.on('end',()=>{
//   console.log('Reading Done')
// })

(async () => {
  await events.once(fileReadStreamCumEventEmitter, "end");
  console.log("Reading Done!!!");
})();

// stream.finished(fileReadStreamCumEventEmitter, (error) => {
//   if (error) {
//     console.log(error.message);
//   } else {
//     console.log("Reading Done!!!");
//   }
// });

//* Alternative way to handle Writable 'finished' event

// fileWriteStreamCumEventEmitter.on('finish', ()=>{
//   console.log('Writing Done')
// })

// (async () => {
//   await events.once(fileWriteStreamCumEventEmitter, "finish");
//   console.log("Writing Finished!!!");
// })();

stream.finished(fileWriteStreamCumEventEmitter, (error) => {
  if (error) {
    console.log(error.message);
  } else {
    console.log("Writing Finished!!!");
  }
});
