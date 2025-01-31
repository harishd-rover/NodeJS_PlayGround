const { Worker } = require("node:worker_threads");

class ThreadPool {
  _freeWorkers = [];
  _TaskQueue = [];

  constructor(PoolSize) {
    console.log("PoolSize", +PoolSize);

    for (let i = 0; i < +PoolSize; i++) {
      const worker = new Worker("./src/workers/worker.js");

      // When Worker Finishes it's Task.
      worker.on("message", (result) => {
        worker?._taskCallback(result); // execute cb pass the results
        this._freeWorkers.push(worker); // move back the worker to freeWorkers
        this._executeNext(); // execute next
      });

      this._freeWorkers.push(worker); // initially all workers are free workers.
    }
  }

  submit(task, cb) {
    this._TaskQueue.push({ task, cb }); // schedule the task and try execute
    this._executeNext(cb);
  }

  _executeNext() {
    const freeWorker = this._freeWorkers.shift();
    // If Free Worker Exists
    if (freeWorker) {
      const taskExists = this._TaskQueue.shift(); // Pull the Task.
      if (taskExists) {
        // If Task Exists, assign the task to Worker.
        const { task, cb } = taskExists;
        freeWorker._taskCallback = cb;
        freeWorker.postMessage(task);
      } else {
        // If there is no Task, move worker back to freeWorkers.
        this._freeWorkers.push(freeWorker);
      }
    }
  }
}
module.exports = new ThreadPool(process.env.ROVER_POOL_SIZE ?? 4);
