// Prime Generator Worker File.

const primeGenerator = require("../../lib/prime-generator");
const { workerData, parentPort } = require("node:worker_threads");

const { count, startingNumber } = workerData;

const primes = primeGenerator(count, startingNumber, {
  format: true,
  log: false,
});

parentPort.postMessage(primes);
