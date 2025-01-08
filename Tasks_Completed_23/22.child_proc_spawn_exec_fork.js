import { exec, spawn, fork } from "node:child_process";

//## Exec spawns non-login and non-interactive shell and executes the command in the shell. and returns the stdout of the shell process.
//## When we use Exec, stdOut and stdErr are buffered, once the child process is is ended/quited, we get the whole buffer at once.
const shell_childProcess = exec(
  "node ../assets/script_exec.js",
  (err, stdout, stderr) => {
    if (!err) {
      console.log(stdout);
      console.log("node:exec Done!!!");
    }
  }
);
//*************************************************************/

//## node:child_process.spawn()
//## spawn directly spawns the process, No Shell is involved here...
//## Here we can access the data streams of the child process, no bufferring.
const node_childProcess = spawn("node", ["../assets/node_child_process.js"]);

node_childProcess.stdin.write("Hello From Parent Process");

setInterval(() => {
  node_childProcess.stdin.write("Ping!!! From Parent Process");
}, 2000);

node_childProcess.stdout.on("data", (data) => {
  console.log(`Message from ChildProcess : ${data.toString()}`);
});
//********************************************************/

//## node:child_process.fork()
//## Fork:- Spawning it's own process.
//## It uses the Master-Worker Terminalogy.
//## child_process.fork() is used to spawn only node processes. it provides better IPC(inter process communication) between Master and Worker processes. by providing Message Channels.

const workerProcess = fork("../assets/node_forked_worker.js");

workerProcess.send("Hello message From Master");

setInterval(() => {
  workerProcess.send("Ping!!! From Master");
}, 2000);

workerProcess.on("message", (message) => {
  console.log(`Message from Worker : ${message}`);
});
