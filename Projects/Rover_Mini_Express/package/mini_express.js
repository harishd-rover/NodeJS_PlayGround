import http from "node:http";
import path from "node:path";
import fsPromises from "node:fs/promises";
import { pipeline } from "node:stream";
import { MIME_TYPES } from "./util/mime_types.js";
import {
  jsonBodyParser,
  cookiesParser,
  urlParamsParser,
} from "./util/middlewares.js";
import StreamifyJSON from "./util/streamify_json.js";

const ERROR_MSG = "Something went wrong! Please try again later.";
export default class MiniExpress {
  _server = null;
  _routeMap = new Map();
  _middlewares = [];
  handleError = null;

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

      // To set Cookie to Responce
      res.setCookie = (key, value) => {
        res.setHeader("Set-Cookie", `${key}=${value};httpOnly;`);
        return res;
      };

      // To set Cookie to Responce
      res.removeCookie = (key) => {
        res.setHeader("Set-Cookie", `${key}=;Max-Age=0;`);
        return res;
      };

      res.download = (fileName, size, mime_type) => {
        if (size) {
          // To show download estimations to user.
          res.setHeader("Content-Length", size);
        }
        if (mime_type) {
          res.setHeader("Content-Type", mime_type);
        }
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=${fileName}`
        );
        return res;
      };

      //To set Content type and content length
      res.justifyContent = (mime_type, size) => {
        res.setHeader("Content-Type", mime_type);
        res.setHeader("Content-Length", size);
        return res;
      };

      //To Redirect to another URL
      res.redirect = (url, statusCode) => {
        res.status(statusCode ?? 303);
        res.setHeader("Location", url);
        res.end();
      };

      // To server the File
      res.sendFile = async (relativePath) => {
        const extName = path.extname(relativePath);
        const mime_type = MIME_TYPES.get(extName);
        res.setHeader("Content-Type", mime_type);

        const fileReadStream = (
          await fsPromises.open(relativePath)
        ).createReadStream();

        return new Promise((resolve, reject) => {
          pipeline(fileReadStream, res, (err) => {
            if (err) {
              console.log(err.message);
              reject(err.message);
            } else {
              console.log("File Successfully Sent");
              resolve();
            }
          });
        });
      };

      // Adding Middlewares Execution logic
      let count = 0;
      /**
       * if responce is handled in middleware, end the navigation to next action
       * @param {boolean} navigate
       * @returns
       */
      const next = (navigate = true) => {
        if (count < this._middlewares.length) {
          return this._middlewares[count++](req, res, next);
        }
        // Once after all middleware done then only execute routes
        // ! important to check whether the middlewares handled the response.
        else if (navigate && !res.finished) {
          // Validating and Invoking registered Routes
          const currentRoute =
            req.method.toLowerCase() + "_" + req.url.split("?")[0];
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
            this._routeMap.get(currentRoute)(
              req,
              res,
              this._handleError(req, res)
            );
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
      this._routeMap.set(fileRoute, async (req, res) => {
        await res.sendFile(routesFilesMap.get(fileRoute));
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
   * Use setHandleError to set this app error handling.
   * @param {req} req
   * @param {res} res
   * @returns (error)=>{}
   */
  _handleError(req, res) {
    return (error) => {
      res.setHeader("Connection", "close");

      if (this.handleError) {
        // if handle error is provided then use it.
        this.handleError(error, req, res);
      } else {
        // else use this error handling.
        res.status(error?.status ?? 500).json({
          error: error?.error ?? ERROR_MSG,
        });
      }
    };
  }

  /**
   * setErrorHandler
   * @param {(error, req, res) => { handleError }} cb
   */
  setErrorHandler(cb) {
    this.handleError = cb;
  }

  /**
   * Start the Server to Listen on PORT.
   * @param {number} port
   * @param {Fn} cb
   */
  listen(port = 3000, cb) {
    console.log("-----------------Middleswares--------------");
    console.log(this._middlewares);
    console.log("-----------------Routes--------------------");
    console.log(this._routeMap.entries());
    this._server.listen(port, () => {
      cb();
    });
  }
}

export {
  jsonBodyParser,
  cookiesParser,
  urlParamsParser,
  StreamifyJSON,
  MIME_TYPES as mime_types,
};
