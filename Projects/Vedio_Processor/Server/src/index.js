import MiniExpress from "rover-mini-express";
import path from "node:path";
import * as roverMiddlewares from "rover-mini-express/middlewares";
import { authenticate } from "./middleware/auth.js";
import { serveIndex } from "./middleware/serveIndex.js";
import { setUserRoutes } from "./routes/users.js";
import { setVideoRoutes } from "./routes/videos.js";

const PORT = 3000;

const app = new MiniExpress();

// For serving static files
app.serveStatic(path.resolve(import.meta.dirname, "../public/"));

// For parsing JSON body
app.setMiddleware(roverMiddlewares.jsonBodyParser);

// For parsing URL QueryParams
app.setMiddleware(roverMiddlewares.urlParamsParser);

// parse cookies from the request
app.setMiddleware(roverMiddlewares.cookiesParser);

// For authentication
app.setMiddleware(authenticate);

// For different routes that need the index.html file
app.setMiddleware(serveIndex);

// -----API Routes----- \\

// user Routes
setUserRoutes(app);
// Video Routes
setVideoRoutes(app);

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
