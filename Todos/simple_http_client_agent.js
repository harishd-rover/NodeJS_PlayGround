import * as http from 'node:http';


const httpAgent = new http.Agent()


const request = http.request()

request.on('response', (response)=>{
  
})


// console.log(http.STATUS_CODES);
// console.log(http.METHODS);