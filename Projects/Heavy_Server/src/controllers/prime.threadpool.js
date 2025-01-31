const threadPool = require("../../lib/thread.pool");

const handlePrimes = (req, res, handleError) => {
  let startingNumber = +req.params.get("start");
  const count = +req.params.get("count");

  if (startingNumber > Number.MAX_SAFE_INTEGER) {
    startingNumber = BigInt(startingNumber);
  }

  const start = performance.now();

  threadPool.submit(
    {
      taskName: "generatePrimes",
      taskData: { count, startingNumber },
    },
    (primes) => {
      return res.json({
        primes: primes,
        time: ((performance.now() - start) / 1000).toFixed(2),
      });
    }
  );
};
exports.handlePrimes = handlePrimes;
