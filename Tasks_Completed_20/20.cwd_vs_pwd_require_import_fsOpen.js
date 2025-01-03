console.log("\n", "PWD: Parent Working Directory of this File");
console.log(import.meta.dirname, "\n");
// console.log(__dirname, "\n");  // incase of CommonJS module system,

console.log("CWD: Current Working Directory of the process");
console.log(process.cwd(), "\n");

//* require() and import {} keywords of the Module Systems, resolves the Relative Paths w.r.t Parent working directory(PWD) the current File. i.e.
//* import.meta.dirname. incase of ES Module System
//* __dirname. incase of CommonJS Module System

//* But open() method of the fs module, resolves the Relative Paths w.r.t the Current Working Directory(CWD) of the process. i.e.
//* process.cwd()

//? So When we are working with fs Module, it's better to explicitely resolve the relative paths w.r.t to the Parent Working Directory(__dirname) of the current File and pass the absolute path to the fs open() method or any fs method that opens the the files. So that fs open() method always works properly incase of process starts in any current working directory.

// PS C:\Users\haris\Desktop> node .\NodeJS_PlayGround\Tasks_Pending\20.cwd_vs_pwd_require_import_fsOpen.js

//  PWD: Parent Working Directory of this File
// C:\Users\haris\Desktop\NodeJS_PlayGround\Tasks_Pending 

// CWD: Current Working Directory of the process
// C:\Users\haris\Desktop 