import cluster from "node:cluster";
if (cluster.isPrimary) {
  const cores_count = (await import("node:os")).availableParallelism();

  console.log(`Forking ${cores_count} Workers`);

  for (let i = 0; i < cores_count; i++) {
    cluster.fork();
  }

  // Recreating new Workers when they Exit...
  cluster.on("exit", (worker) => {
    console.log("Worker Exitted with Pid", worker.process.pid);
    console.log("Forking new Worker again !!!");
    cluster.fork();
  });
} else {
  import("./index.js");
}
