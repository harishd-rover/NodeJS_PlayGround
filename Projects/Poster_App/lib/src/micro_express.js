import http from "node:http";
import path from "node:path";
import fsPromises from "node:fs/promises";
import { pipeline } from "node:stream";
import { MIME_TYPES } from "./mime_types.js";

export default class MicroExpress {
  httpServer = null;
  routesMap = new Map();

  constructor() {
    this.httpServer = http.createServer();

    this.httpServer.on("request", (req, res) => {
      // Attaching Response Methods
      if(process.env.SERVER_NAME){
        console.log(req.method, req.url ,"Request on", process.env.SERVER_NAME)
      }

      res.json = (jsonObj) => {
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify(jsonObj));
      };

      res.status = (code) => {
        res.statusCode = code;
        return res;
      };

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

      // Validating and Invoking registered Routes
      const activeRoute = req.method.toLowerCase() + "_" + req.url;
      if (!this.routesMap.has(activeRoute)) {
        res.status(404).json({ error: "Invalid Route" });
      } else {
        this.routesMap.get(activeRoute)(req, res);
      }
    });
  }

  route(method, path, cb) {
    this.routesMap.set(method.toLowerCase() + "_" + path, cb);
  }

  listen(port = 3000, cb) {
    this.httpServer.listen(port, () => {
      cb();
    });
  }
}
