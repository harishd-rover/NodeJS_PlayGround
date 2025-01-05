import { spawn } from "node:child_process";
import fs from "node:fs";
import { pipeline } from "node:stream";

const c_process = spawn("../assets/num_format.exe", [
  "../assets/num_format_output.txt",
  "$",
  ",",
]);

const num_input_stream = fs.createReadStream("../assets/num_format_input.txt");

pipeline(num_input_stream, c_process.stdin, (err) => {
  if (!err) {
    console.log("Processing Done!!!");
  }
});

c_process.on("close", (code) => {
  if (code === 0) {
    console.log("C process exited with code 0.");
  }
});
