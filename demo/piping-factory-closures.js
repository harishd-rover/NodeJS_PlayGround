
const add10 = (a) => a + 10;
const dif10 = (a) => a - 10;
const mul10 = (a) => a * 10;


// const piped = (...oparations) => {
//   // creating the factory. which is having the closure with 'operations'.
//   return (value) => {
//     for (const op of oparations) {
//       value = op(value);
//     }
//     return value;
//   }
// }



//* Using Reduce higher order function....

// console.log([2,2,2,2,2].reduce((acc, cur)=>{
//   return acc+cur;
// },0))


const piped = (...oparations) => {
  return (initialValue) => {
    return oparations.reduce((acc, operation) => {
      return operation(acc);
    }, initialValue)
  }
}

console.log(piped(add10, mul10, dif10)(10));





