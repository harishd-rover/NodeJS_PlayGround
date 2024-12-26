import http from "node:http";
import path from "node:path";
import fsPromises from "node:fs/promises";
import { pipeline } from "node:stream";
import { MIME_TYPES } from "./mime_types.js";

export default class MiniExpress {
  _server = null;
  _routeMap = new Map();

  constructor() {
    this._server = http.createServer();

    // Logging for Debugging.
    this._server.on("request", (req, res) => {
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
      // Adding Middlewares logic

      // Validating and Invoking registered Routes
      const currentRoute = req.method.toLowerCase() + "_" + req.url;
      if (!this._routeMap.has(currentRoute)) {
        res.status(404).json({ error: "Invalid Route" });
      } else {
        this._routeMap.get(currentRoute)(req, res);
      }
    });
  }

  route(method, path, cb) {
    this._routeMap.set(method.toLowerCase() + "_" + path, cb);
  }

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

  listen(port = 3000, cb) {
    console.log(this._routeMap.entries());
    this._server.listen(port, () => {
      cb();
    });
  }
}
