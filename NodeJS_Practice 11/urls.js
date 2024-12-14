const url = new URL(
  "https://www.google.com/google-api/search?q=create+a+stream+from+huge+buffer+node&oq=&gs_lcrp=EgZjaHJvbWUqCQgBECMYJxjqAjIJCAAQIxgnGOoCMgkIARAjGCcY6gIyCQgCECMYJxjqAjIJCAMQIxgnGOoCMgkIBBAjGCcY6gIyCQgFECMYJxjqAjIJCAYQIxgnGOoCMgkIBxAjGCcY6gLSAQkxMTM4ajBqMTWoAgiwAgE&sourceid=chrome&ie=UTF-8"
);

console.log(url.hostname); // www.google.com
console.log(url.searchParams); // queryParams
console.log(url.pathname); // /api/search
console.log(url.host); // www.google.com
console.log(url.port); // incase of ip:port
console.log(url.protocol); // https:

//* URL with IPV6
const urlWithIPort = new URL(
  "https://[2404:6800:4007:82d::2004]:443/google-api/search?q=create+a+stream+from+huge+buffer+node&oq=&gs_lcrp=EgZjaHJvbWUqCQgBECMYJxjqAjIJCAAQIxgnGOoCMgkIARAjGCcY6gIyCQgCECMYJxjqAjIJCAMQIxgnGOoCMgkIBBAjGCcY6gIyCQgFECMYJxjqAjIJCAYQIxgnGOoCMgkIBxAjGCcY6gLSAQkxMTM4ajBqMTWoAgiwAgE&sourceid=chrome&ie=UTF-8"
);

console.log(urlWithIPort.host);
console.log((urlWithIPort.port = 8080));
console.log(urlWithIPort.toString());
