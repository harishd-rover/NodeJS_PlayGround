import fsPromises from "node:fs/promises";
import os from "node:os";

//# Working Solution to Change UV_THREADPOOL_SIZE.
//* Set Temporary Environment variable first,
//* before starting the node process.

//? In windows cmd.
//## =>  SET UV_THREADPOOL_SIZE=12     --> Set
//## =>  echo %UV_THREADPOOL_SIZE%     --> Print
//## SET UV_THREADPOOL_SIZE=12 && node write-many.js

//? In Bash/Zsh
//## =>  export UV_THREADPOOL_SIZE=12   --> Set
//## =>  echo $UV_THREADPOOL_SIZE       --> Print

console.log(process.env.UV_THREADPOOL_SIZE);
// process.env.UV_THREADPOOL_SIZE = os.availableParallelism();
// It does not work in the Main Process.
// Which works in Child Processes.
// console.log(process.env.UV_THREADPOOL_SIZE)

//## FileSystem Tasks are I/O Intensive Tasks.
//! Here Upon Increasing the Libuv's Thread Pool Size then also no much improvement in the performance bcz File System Operations are I/O Intensive Tasks.
//! So File System operations won't be impacted by increasing the CPU Power or CPU Resources.

setTimeout(() => {
  console.log("Started WriteMany...");
  (async () => {
    console.time("WriteMany");
    const fHandle = await fsPromises.open("../assets/write-many.txt", "w");
    for (let i = 0; i < 1_000_000; i++) {
      fHandle.write(`${i} `);
    }
    console.timeEnd("WriteMany");
  })();
}, 1000);
