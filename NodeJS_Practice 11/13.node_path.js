//* Getting the current File and Directory path
//* When we use CommonJS modules
// console.log("from CommonJS Modules");
// console.log(__dirname);
// console.log(__filename);

//* When we use ES6 modules.
import * as fsPromise from "node:fs/promises";
console.log("from ES6 Modules");
console.log(import.meta.dirname);
console.log(import.meta.filename);

import * as path from "node:path";
console.log(path.resolve() === process.cwd());
// path.resolve() => prints current working Directory

// ? Difference between Path.join() and path.resolve().
// When we are using the __dirname/__filename(Absolute paths) as a first path.
// both path.resolve() and path.join() will return the same.

console.log(
  "Path-Resolve:",
  path.resolve(import.meta.dirname, "../assets/upload.jpg")
);

console.log(
  "path-Join   :",
  path.join(import.meta.dirname, "../assets/upload.jpg")
);

console.log(
  "Directory => Directory path: ",
  path.dirname(path.join(import.meta.dirname, "../../../assets/upload.jpg"))
);

console.log(
  "basename of the Dir path: ",
  path.basename(
    path.dirname(path.join(import.meta.dirname, "../../../assets/upload.jpg"))
  )
);

console.log(
  "basename of the File path: ",
  path.basename(path.join(import.meta.dirname, "../../../assets/upload.jpg"))
);

console.log(
  "extname of the File path: ",
  path.extname(path.join(import.meta.dirname, "../../../assets/upload.jpg"))
);

console.log(
  "extname of the Dir path: ",
  path.extname(
    path.dirname(path.join(import.meta.dirname, "../../../assets/upload.jpg"))
  )
);

console.log("*****************************************");

// ? Difference between Path.join() and path.resolve().

//* Join will just joins the paths we provided. just like a relative path.
console.log(`Join => 'harish','desktop','myprogram.js'`);
console.log(path.join("harish", "desktop", "myprogram.js"), "\n");

//* Resolve will resolves the paths wrt the cwd() of the process if we dont provide a absolute path. if we provide absolute path it resolves wrt it.
console.log(`Resolve => 'harish','desktop','myprogram.js'`);
console.log(path.resolve("harish", "desktop", "myprogram.js"));

/*
console.log(path.join(__dirname, "path"));
console.log(path.join(__dirname, "/path"));
console.log(path.join(__dirname, "./path"));
console.log(path.join(__dirname, "../path"));

console.log(path.resolve(__dirname, "path"));
console.log(path.resolve(__dirname, "/path"));
console.log(path.resolve(__dirname, "./path"));
console.log(path.resolve(__dirname, "../path"));

Output:*****************

path.join()***********
/home/user/some/other/segments/path
/home/user/some/other/segments/path
/home/user/some/other/segments/path
/home/user/some/other/path

path.resolve()********
/home/user/some/other/segments/path
/path
/home/user/some/other/segments/path
/home/user/some/other/path
*/
