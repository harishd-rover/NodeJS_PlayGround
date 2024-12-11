import * as http from 'node:http';


const httpAgent = new http.Agent()


const request = http.request()

request.on('response', (response)=>{
  
})