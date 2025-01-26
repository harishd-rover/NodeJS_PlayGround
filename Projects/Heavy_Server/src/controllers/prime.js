// const primeGenerator = require("../../lib/prime-generator");
const { Worker } = require("node:worker_threads");

const handlePrimes = (req, res, handleError) => {
  let startingNumber = +req.params.get("start");
  const count = +req.params.get("count");

  if (startingNumber > Number.MAX_SAFE_INTEGER) {
    startingNumber = BigInt(startingNumber);
  }

  const start = performance.now();

  /** //## Generating primes in the Main Thread. Synchronously.
  
  //! Request Timeout Won't work here, when we are generating the Primes Synchronously in main thread. bcz Main thread is Blocked so Timer Callback won't execute here.

  const timeOut = setTimeout(() => {
    handleError({ status: 500, message: "TimeOut!!!" });
  }, 10000); 

  const primes = primeGenerator(count, startingNumber, {
    format: true,
    log: false,
  });

  clearTimeout(timeOut); 
  
  res.json({
    primes: primes,
    time: ((performance.now() - start) / 1000).toFixed(2),
  });

  */

  //## OutSourcing the CPU Intensive Work to the New Worker Thread.
  //? Request Timers can be achieved only when the MainThread is Free.

  const worker = new Worker("./src/workers/prime-generator.js", {
    // relative path resolved w.r.t process.cwd()
    workerData: {
      startingNumber,
      count,
    },
  });

  // Setting the 10Sec TimeOut. // if Timer is not cleared send Request Timeout Response.
  const timeOut = setTimeout(() => {
    worker.terminate(); // Terminate the Worker
    return handleError({
      status: 408,
      message: "Sorry...😢 Request Timed Out...⌛",
    });
  }, 10_000);

  // Waiting for the message from the prime generator Worker thread.
  worker.on("message", (primes) => {
    clearTimeout(timeOut); // clear/cancel timeout. if we got message early within 10Sec.
    res.json({
      primes: primes,
      time: ((performance.now() - start) / 1000).toFixed(2),
    });
  });
};

module.exports = {
  handlePrimes,
};
