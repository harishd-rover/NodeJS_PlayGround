import { Worker } from "node:worker_threads";

//##=>  process.env.UV_THREADPOOL_SIZE = 12;
//! IT DOES NOT WORK. We need to set this Environment Variable to Node Process. The Parent Node Process.
//! i.e. From the Shell.
//##=>Win:-   SET UV_THREADPOOL_SIZE=12 && node 27.Worker_Threads.js
//##=>Unix:-  export UV_THREADPOOL_SIZE=12 && node 27.Worker_Threads.js

//## Each Worker Threads will have it's own instances of
//## **** Execution Context,
//## **** EventLoop,
//## **** V8 Engine Instance,
//## **** LibUV Instance, and
//## **** All Worker Threads Shares the Host Process's UV_THREADPOOL.
//## **** Workers won't be having it's own UV_THREADPOOL. They use host process's UV_THREADPOOL.

console.log("Hello!! From Main Thread.");
const workerThread1 = new Worker("../assets/cpu.intensive.js");
const workerThread2 = new Worker("../assets/cpu.intensive.js");
// Running 12 Concurrent Tasks.
