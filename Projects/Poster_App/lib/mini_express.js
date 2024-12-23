import http from "node:http";
import path from "node:path";

export default class MiniExpress {
  httpServer = null;
  routesMap = new Map();

  constructor() {
    this.httpServer = http.createServer();

    this.httpServer.on("request", (req, res) => {
      // Attaching Response Methods
      res.json = (jsonObj) => {
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify(jsonObj));
      };

      res.status = (code) => {
        res.statusCode = code;
        return res;
      };

      res.sendFile = (relativePath)=>{
        // const absPath1 = path.resolve(relativePath);
        // const absPath2 = path.resolve('../public/');

        // path.relative()
      }

      // Validating and Invoking registered Routes
      const activeRoute = req.method.toLowerCase() + "_" + req.url;
      if (!this.routesMap.has(activeRoute)) {
        res.status(404).json({ error: "Invalid route" });
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
