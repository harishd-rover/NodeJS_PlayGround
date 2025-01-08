import cluster from "node:cluster";
//# Primary purpose of clustering is to cluster networker applications
//## In cluserting we won't get any PORT conflicts bcz, node:server.listen() handles the cluster mode gracefully, by starting the server at Master process which acts as Proxy to distribute the traffic by using proper IPC between Master & Workers.

if (cluster.isPrimary) {
  //if it's a primary/Master process then only fork new process/new worker.
  // Forking the Workers for all the available CPU logical cores.
  //? Only the Master and Cluster logic should go here...
  const cores_count = (await import("node:os")).availableParallelism();
  console.log("Number of Logical CPU cores: ", cores_count);
  console.log(`Forking ${cores_count} Workers`);
  for (let i = 0; i < cores_count; i++) {
    const worker = cluster.fork();

    // Sending the message to Workers form Master
    setTimeout(() => {
      worker.send("Hello from Master!!!!");
    }, 3000);
  }

  // Recieving the messages from Workers
  cluster.on("message", (worker, message) => {
    console.log(`Message: ${message} from worker pId : ${worker.process.pid}`);
  });

  // Recreating new Workers when they Exit...
  cluster.on("exit", (worker) => {
    console.log("Worker Exitted with Pid", worker.process.pid);
    console.log("Forking new Worker again !!!");
    cluster.fork();
  });
} else {
  //? Only the Worker Logic should go here....
  // if it's worker process then starts the poster server application here.
  import("./app.js");

  // Recieving the message from Master Process
  process.on("message", (message) => {
    console.log("message:", message);
  });

  // Sending the message to the Master
  setTimeout(() => {
    process.send("Hello From New Worker!!!");
  }, 6000);
}
