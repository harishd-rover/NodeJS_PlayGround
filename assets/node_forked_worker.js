// it's forked Worker process
// we can use message channels for inter process communication

process.on("message", (message) => {
  process.send(`Re-Trasmitted from Forked Worker Process : ${message}`);
});

process.send("Hello from Node Forked Worker Process");
