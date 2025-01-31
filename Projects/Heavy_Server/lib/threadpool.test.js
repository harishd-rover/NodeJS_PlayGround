const threadPool = require("./thread.pool");

const numberOfTasks = 12;
console.log("Number of Tasks: ", numberOfTasks);

for (let i = 0; i < numberOfTasks; i++) {
  threadPool.submit(
    {
      taskName: "generatePrimes",
      taskData: { count: 5555, startingNumber: 1000000000000 },
    },
    (primes) => {
      console.log("primes generated!!!");
    }
  );
}
