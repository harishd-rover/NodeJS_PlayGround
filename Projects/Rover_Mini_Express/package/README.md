# RoverMiniExpress - A Lightweight Express-like Framework for Node.js

## Overview

RoverMiniExpress is a lightweight Node.js framework inspired by Express.js. It provides essential features for building web applications and APIs, including routing, middleware support, file serving, and response helpers.

> [!WARNING]  
> Important Note : This package is just for Educational Purpose !!!

## Features

- **Routing**: Define HTTP routes with ease.
- **Middleware Support**: Add custom middleware functions for pre-route processing.
- **Static File Serving**: Serve static files with simple configurations.
- **Ready Middlewares**:

  - `jsonBodyParser` - To parse request body - `req.body` : Object
  - `cookiesParser` - To parse request cookeies - `req.cookies` : Set
  - `urlParamsParser` - To parse request query params - `req.params` : Map

- **Response Helpers**:
  - `res.status(code)` - Set HTTP status code.
  - `res.message(message)` - Set HTTP status message.
  - `res.json(jsonObj)` - Send JSON response.
  - `res.setCookie(key, value)` - Set cookies.
  - `res.removeCookie(key)` - Remove cookies.
  - `res.download(fileName, contentLength)` - Send a file as a downloadable attachment.
  - `res.redirect(url, statusCode)` - Redirect to a specified URL.
  - `res.sendFile(relativePath)` - Serve a file to the client.

---

## Installation

1. Ensure you have Node.js installed.
2. Install rover-mini-express package
   ` npm install rover-mini-express`

## Usage

### 1. Creating a MiniExpress Application

```javascript
import MiniExpress from "rover-mini-express";

const app = new MiniExpress();
```

### 2. Defining Routes

```javascript
app.route("GET", "/", (req, res) => {
  res.json({ message: "Welcome to MiniExpress!" });
});

app.route("POST", "/data", (req, res) => {
  res.json({ success: true });
});
```

### 3. Adding Middleware

```javascript
app.setMiddleware(jsonBodyParser);

app.setMiddleware(urlParamsParser);

app.setMiddleware(cookiesParser);

app.setMiddleware((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});
```

### 4. Serving Static Files

```javascript
app.serveStatic("./public");
```

### 5. Easy Error Handling, RoverMiniExpress provides default error handling for routes

```javascript
// set custom app error handler
app.setErrorHandler((error, req, res) => {
  // Do something with errors at one place
  console.log("Error: ", error);
  res
    .status(error?.status ?? 500)
    .json({ testAppError: error?.error ?? "TestApp Error" });
});

// use app error handler in each routes
app.route("get", "/api", (req, res, handleError) => {
  if (req.params.get("error")) {
    return handleError({ status: 501, error: "My Route Error" });
  }
});
```

### 6. Starting the Server

```javascript
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
```

---

## Example Application

```javascript
import MiniExpress, {
  jsonBodyParser,
  cookiesParser,
  urlParamsParser,
  StreamifyJSON,
  mime_types,
} from "rover-mini-express";

// import MiniExpress from "rover-mini-express";
// import {
//   jsonBodyParser,
//   cookiesParser,
//   urlParamsParser,
// } from "rover-mini-express/middlewares";
// import StreamifyJSON from "rover-mini-express/streamify_json";
// import { MIME_TYPES } from "rover-mini-express/mime_types";

const app = new MiniExpress();

app.setMiddleware(jsonBodyParser);

app.setMiddleware(urlParamsParser);

app.setMiddleware(cookiesParser);

app.setErrorHandler((error, req, res) => {
  // Do something with errors at one place
  console.log("Error: ", error);
  res
    .status(error?.status ?? 500)
    .json({ testAppError: error?.error ?? "Test App Error" });
});

app.route("get", "/api", (req, res, handleError) => {
  console.log("Cookies: ", req.cookies);

  if (req.params.get("error")) {
    return handleError({ status: 501, error: "My Route Error" });
  }

  const jsonStream = new StreamifyJSON(
    {
      message: "Hello from Rover Mini Express!!!",
      name: "Harish D",
      status: "Hey Its Working",
    },
    { highWaterMark: 10 },
    true,
    1000
  );

  jsonStream.pipe(res);
});

app.listen(2000, () => {
  console.log("--------------MimeTypes---------------------");
  console.log(mime_types);
  console.log("Server Listening on 2000");
});
```

---

## Notes

- **Middleware Execution**: Middleware functions are executed sequentially before routes are processed. If a middleware sends a response, subsequent routes will not be executed.
- **Static File Serving Limitation**: Currently, static file serving does not support nested folders. This feature can be extended in future versions.

---

## Contribution

Contributions, issues, and feature requests are welcome! Feel free to submit a pull request or open an issue in the repository.

---

## License

This project is licensed under the MIT License.
