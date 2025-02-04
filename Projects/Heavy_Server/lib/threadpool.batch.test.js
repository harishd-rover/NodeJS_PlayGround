const threadPool = require("./thread.pool");
const performance_hooks = require("node:perf_hooks");

const numberOfTasks = 100_500;
const start = performance.now();
const batchSize = 10_000;
let total_tasksCompleted = 0;
let currentBatchIndex = 0;

console.log("Number of Tasks: ", numberOfTasks);

function submitNextBatch() {
  // if there are pending tasks submit them in batchs
  if (total_tasksCompleted < numberOfTasks) {
    const batchStartIndex = currentBatchIndex * batchSize;
    const batchEndIndex = Math.min(batchStartIndex + batchSize, numberOfTasks);
    const currentBatchSize = batchEndIndex - batchStartIndex;
    console.log(
      "submitted batch:",
      currentBatchIndex + 1,
      "of Size: ",
      currentBatchSize
    );
    submitCurrentBatch(batchStartIndex, batchEndIndex); // submit current batch
  }
}

function submitCurrentBatch(batchStartIndex, batchEndIndex) {
  let n_tasksPendingInCurrentBatch = 0;

  for (let i = batchStartIndex; i < batchEndIndex; i++) {
    n_tasksPendingInCurrentBatch++;

    threadPool.submit(
      {
        taskName: "generatePrimes",
        taskData: { count: 100, startingNumber: 10_000_000 },
      },
      (_primes) => {
        total_tasksCompleted++;
        n_tasksPendingInCurrentBatch--;

        if (total_tasksCompleted % Math.floor(batchSize / 4) == 0) {
          // to Limit the performance logs to 4 logs per batch.
          console.log(performance_hooks.performance.eventLoopUtilization());
        }

        // exit once all tasks completed
        if (total_tasksCompleted >= numberOfTasks) {
          const timeTaken = ((performance.now() - start) / 1000).toFixed(2);
          console.log("Primes generation done!!!  took", timeTaken, "sec");
          process.exit();
        }

        // When all tasks in the current batch are done.
        // create and submit next batch
        if (n_tasksPendingInCurrentBatch <= 0) {
          currentBatchIndex++;
          submitNextBatch();
        }
      }
    );
  }
}

submitNextBatch(); // Submit First batch
