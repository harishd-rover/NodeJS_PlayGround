import v8 from "node:v8";

// JSON Parse and Stringify can only work with JSON data.
const data = JSON.parse('{"name":"harish"}');
console.log(data);

const string = JSON.stringify(data);
console.log(string);

const serializedData = v8.serialize({ name: "Harish" }); // returns Buffer
console.log(serializedData);

const deserializedData = v8.deserialize(serializedData);
console.log(deserializedData);
