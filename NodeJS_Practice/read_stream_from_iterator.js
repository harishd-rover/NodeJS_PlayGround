import { Readable } from "node:stream";

const timer = (value, time) =>
  new Promise((resolve) => setTimeout(() => resolve(value), time));

async function* nameGeneratorFn() {
  yield await timer(Buffer.from("hello1", "utf-8"), 500);
  yield await timer(Buffer.from("hello1", "utf-8"), 500);
  yield await timer(Buffer.from("hello1", "utf-8"), 500);
  yield await timer(Buffer.from("hello1", "utf-8"), 500);
  yield await timer(Buffer.from("hello1", "utf-8"), 500);
  yield await timer(Buffer.from("hello1", "utf-8"), 500);
  yield await timer(Buffer.from("hello1", "utf-8"), 500);
}

const asynIteratorObj = {
  //* Object which implements the iterator pattern.
  [Symbol.asyncIterator]: nameGeneratorFn,
};

const readStreamFromGenerator = Readable.from(nameGeneratorFn());
const readStreamFromIterator = Readable.from(asynIteratorObj);

readStreamFromIterator.setEncoding("utf-8");

for await (const data of readStreamFromIterator) {
  console.log(data);
}
