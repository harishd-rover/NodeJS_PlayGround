import path from "node:path";

//# path.relative() v/s path.resolve()
//## path.relative(from, to) : Rel_Path
//## path.resolve(paths) : Abs_Path

//## path.relative() is the Reverse Transform of path.resolve().
//## path.resolve() always resolves to Absolute Path either with provided Abs_Path or with CWD.
//## path.relative() always resolves to Relative Path.

//## path.relative(from, to) will resolve the {from} and {to} paths to Abs_Paths (just like path.resolve()) and then compares the difference and returns the relative path.

console.log(path.resolve("desktop")); // resolving to absolute path.
console.log(path.resolve("desktop/node")); // resolving to absolute path.

// In order to move from ...cwd/desktop to ...cwd/desktop/node
// I should cd(change directory) to node.
console.log(path.relative("desktop", "desktop/node"));
console.log("****************************************");

console.log(path.resolve("desktop")); // resolving to absolute path.
console.log(path.resolve("/desktop")); // resolving to absolute path.

// to move from ...cwd/desktop to (root)/desktop
// I should cd back height of cwd times then ./desktop( or desktop).
console.log(path.relative("desktop", "/desktop"));
console.log("****************************************");
