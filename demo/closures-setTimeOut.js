// ***********  Closure Effects   ****************


// for (var i = 0; i < 5; i++) {
//   setTimeout(() => {     
//     console.log(i)
//   })
// }

// ReSult: 55555


// when we use var it is same as below

// var i;
// for (i = 0; i < 5; i++) {
//   setTimeout(() => {
//     console.log(i)      // it has a closure with global variable i;
//   })
// }


// for (let i = 0; i < 5; i++) {
//   setTimeout(() => {
//     console.log(i)     // it has a closure with block/local variable i;
//   })
// }

// ReSult: 01234




for (var i = 0; i < 5; i++) {
  ((i) => {    // Another i variable is created to this ananymous function scope.
    setTimeout(() => {
      console.log(i);   // Now it has closure with new variable i.
    })
  })(i);   //!important to remember
}




//* Where ever we register callbacks/event hanlders and Where ever we have nested functions - 
//* Everywhere we can see the closure effects
//* They will be having the references to it's lexical environment variables
