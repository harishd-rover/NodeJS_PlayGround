import { stdin, stdout, stderr } from "node:process";

stdin.on("data", (data) => {
  stdout.write(`Re-Trasmitted from Node ChildProcess : ${data.toString()}`);
});

stdout.write("Hello from Node Child Process");
