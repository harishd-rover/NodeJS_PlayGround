import * as http from "node:http";
import * as fsPromise from "node:fs/promises";
import { pipeline } from "node:stream";

const httpServer = http.createServer(); // we can request listener here...

httpServer.on("request", (req, res) => {
  console.log("Http Request Line:--------- ");
  console.log(req.method, req.url, req.httpVersion);

  console.log("Http Request Headers:---------- ");
  console.log(req.headers);

  console.log("Http Request Body:-------");
  
  req.on("data", (buffer) => {
    console.log(buffer.toString());
  });

  req.on("end", async () => {
    console.log("Request successfully recieved!!!");

    // Now we can Write something to response here...
    res.setHeaders(
      new Map([
        ["Content-Type", "text/html"],
        ["Set-Cookie", "Name=Harish"],
      ])
    );

    res.statusCode = 200;
    res.statusMessage = "OK";

    {
      // Pipe and Pipeline will cleanup all the resources once the pipe is Done.
      const fileHandle = await fsPromise.open("../assets/index.html", "r");
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

    // Finish indicates Response is written to the underlying socket.
    // Response may not reached to the client.
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
