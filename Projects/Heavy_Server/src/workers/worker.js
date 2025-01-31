const primeGenerator = require("../../lib/prime-generator");
const { workerData, parentPort } = require("node:worker_threads");

parentPort.on("message", (message) => {
  let result;
  switch (message.taskName) {
    case "generatePrimes":
      result = primeGenerator(
        message.taskData.count,
        message.taskData.startingNumber
      );
      break;

    default:
      break;
  }

  if (result) {
    // Send message to host process when Job is Done.
    parentPort.postMessage(result);
  }
});
