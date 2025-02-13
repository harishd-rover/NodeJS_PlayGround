//# Compression
//## It is a kind of Encoding that uses fewer number of bits. Most commonly used compression and decompression algorithms are gzip, deflate/inflate and brotli.

//## Node provides only Lossless Compression. gZip, deflate, brotli are lossless compression algorithms.

//## Node uses open source standalone compression/decompression packages like ZLib(gZip, deflate/inflate) and Brotli to achieve this.

//## Node provides the compression and decompression functionalities in the form of Trasnform Stream Apis to deal with compression and decompression of huge files. (API's starts with create_).

//## and also provides Buffer APIs to deal with compression and decompression of smaller data.(be aware of buffering)

//## Compression and Decompression are CPU Intensive operations that uses UV_Thread Pool to perform it Asynchronously.(Cache Frequent Files).

import {
  gzip, // Buffer APIs
  gunzip,
  deflate,
  inflate,
  brotliCompress,
  brotliDecompress,
  createGzip, // Transform Stream APIs
  createGunzip,
  createDeflate,
  createInflate,
  createBrotliCompress,
  createBrotliDecompress,
} from "node:zlib";
import fs from "node:fs";
import { pipeline } from "node:stream/promises";

// Compression
// const src = fs.createReadStream("../assets/large-file.json");
// const dest = fs.createWriteStream("../assets/large-file-compressed");

// const gZip = createGzip();
// try {
//   await pipeline(src, gZip, dest);
// } catch (error) {
//   console.log(error);
// }

// Decompression
const src1 = fs.createReadStream("../assets/large-file-compressed");
const dest1 = fs.createWriteStream("../assets/large-file-uncompressed.json");

const gunZip = createGunzip();
try {
  await pipeline(src1, gunZip, dest1);
} catch (error) {
  console.log(error);
}
