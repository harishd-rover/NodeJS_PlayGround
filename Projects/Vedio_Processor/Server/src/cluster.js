import cluster from "node:cluster";
import { JobQueue } from "../../Server/src/services/job-queue.service.js";

if (cluster.isPrimary) {
  const cores_count = (await import("node:os")).availableParallelism();
  console.log(`Forking ${cores_count} Workers`);

  for (let i = 0; i < cores_count; i++) {
    cluster.fork();
  }

  //## For supporting the Resize Job Resumes in ClusterMode...
  //## We should maintain singleton JobQueue Instance accross the cluster.
  //## We can achieve this by, only creating the JobQueue Instance in Master Process.
  //## For scheduling jobs, Workers can communicate with Master process using Message Channels.
  //## Master will schedules the resize jobs.

  const jobQueue = JobQueue.Queue; // To Start Pending Jobs.

  cluster.on("message", (worker, message) => {
    jobQueue.enqueue(message); // Handle resize jobs.
  });

  // Recreating new Workers when they Exit...
  cluster.on("exit", (worker) => {
    console.log("Worker Exitted with Pid", worker.process.pid);
    console.log("Forking new Worker again !!!");
    cluster.fork();
  });
} else {
  import("./index.js");
}
