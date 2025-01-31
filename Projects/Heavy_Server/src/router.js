// Controllers
const User = require("./controllers/user");

const Prime = require("./controllers/prime.js");

const PrimeThreadPool = require('./controllers/prime.threadpool.js')

module.exports = (app) => {
  // Log a user in and give them a token
  app.route("post", "/api/login", User.logUserIn);

  // Log a user out
  app.route("delete", "/api/logout", User.logUserOut);

  // Send user info
  app.route("get", "/api/user", User.sendUserInfo);

  // Update a user info
  app.route("put", "/api/user", User.updateUser);

  // prime generator routes  => primes?count=12121&start=100000000000
  // app.route("get", "/api/primes", Prime.handlePrimes);
  app.route("get", "/api/primes", PrimeThreadPool.handlePrimes);
};
