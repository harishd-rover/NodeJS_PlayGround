import * as http from "node:http";
import * as fsPromise from "node:fs/promises";
import { pipeline } from "node:stream";
import * as path from "node:path";

const MIME_TYPES = new Map([
  ["css", "text/css"],
  ["js", "text/javascript"],
  ["png", "image/png"],
  ["jpg", "image/jpg"],
  ["html", "text/html"],
  ["txt", "text/plain"],
]);

let dataChunks = [];

const httpServer = http.createServer(); // we can request listener here...

httpServer.on("request", async (req, res) => {
  console.log("Http Request Line:--------- ");
  console.log(req.method, req.url, req.httpVersion);

  console.log("Http Request Headers:---------- ");
  console.log(req.headers);

  //? in ES6 Modules __dirname ==>> import.meta.dirname  ==>> directory path of this File.
  //? in ES6 Modules __filename ==>> import.meta.filename ==>> file path of this File.
  if (req.url === "/uploadJpg" && req.method === "PUT") {
    const uploadPath = path.join(import.meta.dirname, "../assets/upload.jpg");
    const fileHandle = await fsPromise.open(uploadPath, "w");
    const writeStream = fileHandle.createWriteStream();
    pipeline(req, writeStream, (error) => {
      if (error) {
        console.log("Error Happened while Upload!!!", error);
      } else {
        res.end(`File Uploaded Successfully to : ${uploadPath}`);
      }
    });
    return;
  } else {
    // Don't read here incase of File Upload
    console.log("Http Simple Request Body:-------");
    // Read only when/where it's needed.
    // req.on("data", (chunk) => {
    //   dataChunks.push(chunk);
    // });
    dataChunks = [];
    (async () => {
      for await (const chunk of req) {
        dataChunks.push(chunk);
      }
      // make sure you don't perform anything here... related to saving chunks
    })();
  }

  req.on("end", async () => {
    console.log("Request successfully read!!!");
    // Now we can Write something to response here...

    // Handling / Route********************
    if (req.method === "GET" && req.url === "/") {
      res.setHeaders(
        new Map([
          ["Content-Type", "text/html"],
          ["Set-Cookie", "Name=Harish"],
        ])
      );
      res.statusCode = 200;
      {
        // Pipe and Pipeline will cleanup all the resources once the pipe is Done. So Create Resources in it's scope itself.
        const indexHtmlPath = path.join(
          import.meta.dirname,
          "../assets/index.html"
        );
        const fileHandle = await fsPromise.open(indexHtmlPath, "r");
        const fileReadStream = fileHandle.createReadStream();
        pipeline(fileReadStream, res, (error) => {
          if (error) {
            console.log("Error in writing Response", error);
          } else {
            console.log(
              `File is Written to Response!!! && Response reached Client && Resourses is closed automatically by pipeline`
            );
          }
        });
      }
    }

    // Load Assets*************************
    else if (req.method === "GET" && req.url.includes("/assets/")) {
      res.setHeaders(
        new Map([
          [
            "Content-Type",
            MIME_TYPES.get(req.url.slice(req.url.lastIndexOf(".") + 1)),
          ],
        ])
      );
      res.statusCode = 200;
      {
        // Pipe and Pipeline will cleanup all the resources once the pipe is Done. So Create Resources in it's scope itself.
        const assetsfilePath = path.join(import.meta.dirname, "../", req.url);
        const fileHandle = await fsPromise.open(assetsfilePath, "r");
        const fileReadStream = fileHandle.createReadStream();
        pipeline(fileReadStream, res, (error) => {
          if (error) {
            console.log("Error in writing Response", error);
          } else {
            console.log(
              `File is Written to Response!!! && Response reached Client && Resourses is closed automatically by pipeline`
            );
          }
        });
      }
    }
    // Json Route
    else if (req.url === "/login" && req.method === "POST") {
      // perform authentification Here...
      console.log(Buffer.concat(dataChunks).toString());
      const { username, password } = JSON.parse(
        Buffer.concat(dataChunks).toString()
      );
      if (username === "harish" && password === "123") {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        const resBody = {
          username: username,
          status: "LoggedIn",
        };
        res.end(JSON.stringify(resBody));
      } else {
        res.statusCode = 401;
        res.end("Invalid User!!!");
      }
    } else {
      res.statusCode = 400;
      res.end();
    }

    // Finish Event indicates that Response is written to the underlying socket.
    // Response may not have reached the client.
    res.on("finish", () => {
      console.log("Response is written to the socket Successfully!!!");
    });
  });

  req.on("close", () => {
    console.log("Req: Stream End !!!");
  });

  res.on("close", () => {
    console.log("Res: Stream End !!!");
  });

  // these Socket Events makes sense, when we send multiple simultanious requests with keep-alive/close Agent
  res.socket.on("close", () => {
    console.log("Socket Conenction Closed!!!");
  });
  req.socket.on("close", () => {
    console.log("Socket Conenction Closed!!!");
  });
});

httpServer.on("error", (error) => {
  console.log("Server Error!!!");
  console.log(error);
});

httpServer.listen(3000, "localhost", async () => {
  console.log("Http Server is Listening on ", httpServer.address());
});
