import path from "node:path";
console.log("\n", "PWD: Parent Working Directory of this File");
console.log(import.meta.dirname, "\n");
// console.log(__dirname, "\n");  // incase of CommonJS module system,

console.log("CWD: Current Working Directory of the process");
console.log(process.cwd(), "\n");

//* We can change the current working directory of the process at any time.
console.log("Changing cwd of the process to the Root Directory");

process.chdir("/");

console.log(process.cwd(), "\n");

//* ***********************************************************************************\
//! When we are working with relative paths, The important question we need to understand is, THESE RELATIVE PATHS ARE RESOLVED WITH WHAT ?

//* require() and import {} keywords of the Module Systems, resolves the Relative Paths w.r.t Parent working directory(PWD) the current File. i.e.
//* => import.meta.dirname. Incase of ES Module System
//* => __dirname. Incase of CommonJS Module System.

//* But open() method of the fs module, resolves the Relative Paths w.r.t the Current Working Directory(CWD) of the process. i.e.
//* => process.cwd()

//? So When we are working with fs Module, it's better to explicitely resolve the relative paths w.r.t to the Parent Working Directory(__dirname) of the current File and pass the absolute path to the fs open() method or any fs method that opens the the files. So that fs open() method always works properly incase of process starts in any current working directory.

console.log("Env Variable: PATH");
console.log(process.env.PATH, "\n");

console.log("PATHS:- Delimeter separated");
// In winAPI, paths delimeter is (;)
// In POSIX, paths delimeter is (:)
// node:path.delimeter provides  Plotformwise delimeters
console.log(process.env.PATH.split(path.delimiter));

//? Result:-
// CWD: Current Working Directory of the process
// C:\Users\haris\Desktop\NodeJS_PlayGround

// Changing cwd of the process to the Root Directory
// C:\

// Env Variable: PATH
// C:\windows\system32;C:\windows;C:\windows\System32\Wbem;C:\windows\System32\WindowsPowerShell\v1.0\;C:\windows\System32\OpenSSH\;C:\Program Files (x86)\NVIDIA Corporation\PhysX\Common;C:\Program Files\NVIDIA Corporation\NVIDIA NvDLISR;C:\WINDOWS\system32;C:\WINDOWS;C:\WINDOWS\System32\Wbem;C:\WINDOWS\System32\WindowsPowerShell\v1.0\;C:\WINDOWS\System32\OpenSSH\;C:\Users\haris\AppData\Roaming\nvm;C:\Program Files\nodejs;C:\Program Files\Git\cmd;C:\Users\haris\AppData\Local\Microsoft\WindowsApps;C:\Users\haris\AppData\Roaming\nvm;C:\Program Files\nodejs;C:\Users\haris\AppData\Local\Programs\Microsoft VS Code\bin;

// PATHS:- Delimeter separated
// [
//   'C:\\windows\\system32',
//   'C:\\windows',
//   'C:\\windows\\System32\\Wbem',
//   'C:\\windows\\System32\\WindowsPowerShell\\v1.0\\',
//   'C:\\windows\\System32\\OpenSSH\\',
//   'C:\\Program Files (x86)\\NVIDIA Corporation\\PhysX\\Common',
//   'C:\\Program Files\\NVIDIA Corporation\\NVIDIA NvDLISR',
//   'C:\\WINDOWS\\system32',
//   'C:\\WINDOWS',
//   'C:\\WINDOWS\\System32\\Wbem',
//   'C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\',
//   'C:\\WINDOWS\\System32\\OpenSSH\\',
//   'C:\\Users\\haris\\AppData\\Roaming\\nvm',
//   'C:\\Program Files\\nodejs',
//   'C:\\Program Files\\Git\\cmd',
//   'C:\\Users\\haris\\AppData\\Local\\Microsoft\\WindowsApps',
//   'C:\\Users\\haris\\AppData\\Roaming\\nvm',
//   'C:\\Program Files\\nodejs',
//   'C:\\Users\\haris\\AppData\\Local\\Programs\\Microsoft VS Code\\bin',
//   ''
// ]
