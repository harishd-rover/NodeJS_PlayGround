const { serveIndex, authenticate } = require("./middleware/index.js");
const apiRouter = require("./router.js");
const {
  default: MiniExpress,
  jsonBodyParser,
  urlParamsParser,
} = require("rover-mini-express");

const PORT = 3000;

const app = new MiniExpress();

// ------ Middlewares ------ //

// For serving static files
app.serveStatic("./public");

// For parsing JSON body
app.setMiddleware(jsonBodyParser);

// For different routes that need the index.html file
app.setMiddleware(serveIndex);

app.setMiddleware(authenticate);

app.setMiddleware(urlParamsParser);

// ------ API Routes ------ //
apiRouter(app);

// Handle all the errors that could happen in the routes
app.setErrorHandler((error, req, res) => {
  if (error && error.status) {
    res
      .status(error.status)
      .json({ error: error.message, message: error.message });
  } else {
    console.error(error);
    res.status(500).json({
      error: "Sorry, something unexpected happened from our side.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
