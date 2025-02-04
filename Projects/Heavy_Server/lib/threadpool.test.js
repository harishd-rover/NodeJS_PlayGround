const threadPool = require("./thread.pool");
const performance_hooks = require("node:perf_hooks");
const numberOfTasks = 1_000_000;
console.log("Number of Tasks: ", numberOfTasks);
let n_tasksCompleted = 0;
const start = performance.now();

//## As the value of numberOfTasks increases, the number of tasks in the ThreadPool's TaskQueue increases, at some point couses heap out of memory issue and application crashes.

//## this loop also blocks the execution of all callbacks in this main thread (Blocks the EventLoop).
//## this also blocks the execution of callbacks of all ThreadPool Worker Threads (Worker Pool is Blocked) Until this loop is Over.
//## Blocking the main thread blocks everything.

//## So Instead of submitting all tasks at once to threadPool. we need to do it in BATCHES so that mainThread is lightweight, eventLoop is idle and free and Worker Pool is not Blocked.

for (let i = 0; i < numberOfTasks; i++) {
  threadPool.submit(
    {
      taskName: "generatePrimes",
      taskData: { count: 100, startingNumber: 1_000_000_000 },
    },
    (primes) => {
      if (n_tasksCompleted == 0) {
        console.log("ran callback");
      }
      n_tasksCompleted++;

      if (n_tasksCompleted % 1_000 == 0) {
        console.log(performance_hooks.performance.eventLoopUtilization());
      }

      if (n_tasksCompleted >= numberOfTasks) {
        const timeTaken = ((performance.now() - start) / 1000).toFixed(2);
        console.log("primes generation done!!!  took", timeTaken, "sec");
        process.exit();
      }
    }
  );
}
