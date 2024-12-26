import http from "node:http";
import path from "node:path";
import fsPromises from "node:fs/promises";
import { pipeline } from "node:stream";
import { MIME_TYPES } from "./mime_types.js";

export default class MiniExpress {
  _server = null;
  _routeMap = new Map();
  _middlewares = [];

  constructor() {
    this._server = http.createServer();

    this._server.on("request", (req, res) => {
      // To Set Response Status code
      res.status = (code) => {
        res.statusCode = code;
        return res;
      };

      // To Set Response status message
      res.message = (message) => {
        res.statusMessage = message;
        return res;
      };

      // To Write JSON to Responce
      res.json = (jsonObj) => {
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify(jsonObj));
      };

      // To server the File
      res.sendFile = async (relativePath) => {
        const extName = path.extname(relativePath);
        const mime_type = MIME_TYPES.get(extName);
        res.setHeader("Content-Type", mime_type);

        const fileReadStream = (
          await fsPromises.open(relativePath)
        ).createReadStream();

        pipeline(fileReadStream, res, (err) => {
          if (err) {
            console.log(err.message);
          }
          {
            console.log("File Successfully Sent");
          }
        });
      };

      // Adding Middlewares Execution logic
      let count = 0;
      const next = () => {
        if (count < this._middlewares.length) {
          this._middlewares[count++](req, res, next);
        }
        // Once after all middleware done then only execute routes
        else {
          // Validating and Invoking registered Routes
          const currentRoute = req.method.toLowerCase() + "_" + req.url;
          if (!this._routeMap.has(currentRoute)) {
            res.status(404).json({ error: "Invalid Route" });
          } else {
            // Logging for Debugging.
            if (process.env.SERVER_NAME) {
              console.log(
                "Processing",
                req.method,
                req.url,
                "on",
                process.env.SERVER_NAME
              );
            } else {
              console.log("Processing", req.method, req.url);
            }
            this._routeMap.get(currentRoute)(req, res);
          }
        }
      };

      next(); // Invoking the First middleware
    });
  }

  /**
   * To Set the App Routes
   * @param {string} method
   * @param {path} path
   * @param {Fn} cb
   */
  route(method, path, cb) {
    this._routeMap.set(method.toLowerCase() + "_" + path, cb);
  }

  /**
   * TO Serve Static Content, won't work for nested folders. !TODO
   * @param {RelativePath} folderPath
   */
  async serveStatic(folderPath) {
    const directoryFiles = await fsPromises.readdir(folderPath);
    const routesFilesMap = new Map(
      directoryFiles.map((fileName) => [
        `get_/${fileName}`,
        `${folderPath}/${fileName}`,
      ])
    );

    routesFilesMap.keys().forEach((fileRoute) => {
      this._routeMap.set(fileRoute, (req, res) => {
        res.sendFile(routesFilesMap.get(fileRoute));
      });
    });
  }

  /**
   * Setup middleware function which will be executed before any route is invoked.
   * @param {(req, res, next)=>{}} middleWareFn
   */
  setMiddleware(middleWareFn) {
    this._middlewares.push(middleWareFn);
  }

  /**
   * Start the Server to Listen on PORT.
   * @param {number} port
   * @param {Fn} cb
   */
  listen(port = 3000, cb) {
    console.log(this._routeMap.entries());
    this._server.listen(port, () => {
      cb();
    });
  }
}
