// Controllers
const User = require("./controllers/user");

const generatePrimes = require("../lib/prime-generator.js");

module.exports = (app) => {
  // Log a user in and give them a token
  app.route("post", "/api/login", User.logUserIn);

  // Log a user out
  app.route("delete", "/api/logout", User.logUserOut);

  // Send user info
  app.route("get", "/api/user", User.sendUserInfo);

  // Update a user info
  app.route("put", "/api/user", User.updateUser);

  // prime generator routes

  app.route("get", "/api/primes", (req, res, handleError) => {
    let startingNumber = +req.params.get("start");
    const count = +req.params.get("count");

    if (startingNumber > Number.MAX_SAFE_INTEGER) {
      startingNumber = BigInt(startingNumber);
    }

    const start = performance.now();

    const primes = generatePrimes(count, startingNumber, {
      format: true,
      log: true,
    });

    res.json({
      primes: primes,
      time: ((performance.now() - start) / 1000).toFixed(2),
    });
  });
};
