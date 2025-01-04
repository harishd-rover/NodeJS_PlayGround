import process from "node:process";

//* When we start the node process using the TTY Shell. The data communication between the Node process and TTY process is already been established.

(async () => {
  process.stdin.setEncoding("utf-8");
  for await (const data of process.stdin) {
    // console.log("Data From TTY : ", data);
    process.stdout.write(`Data From TTY : ${data}`);
  }
})();

setInterval(() => {
  process.stdout.write("Data from Node Process:StdOut\n");
}, 4000);

setTimeout(() => {
  setInterval(() => {
    process.stderr.write("Data from Node Process:StdErr\n");
  }, 4000);
}, 2000);
