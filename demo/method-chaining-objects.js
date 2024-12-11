
//* Using class

class Calculator {
  constructor(value = 0) {
    this.value = value
  }

  sum(oparand) {
    this.value += oparand;
    return this;
  }

  difference(oparand) {
    this.value -= oparand;
    return this;
  }

  multiply(oparand) {
    this.value *= oparand;
    return this;
  }

  get Value() {
    return this.value;
  }
}

const cal = new Calculator();

console.log(cal.sum(10).difference(5).multiply(5).Value);




//* Using constructor Functions

// function CalculatorFn(initialValue = 0) {
//   this.value = initialValue;
//   this.sum = (oparand) => {
//     this.value += oparand;
//     return this;
//   }

//   this.difference = (oparand) => {
//     this.value -= oparand;
//     return this;
//   }

//   this.multiply = (oparand) => {
//     this.value *= oparand;
//     return this;
//   }

//   this.getValue = () => {
//     console.log('Result: ', this.value);
//     // return this.value;
//   }
// }


// const cal = new CalculatorFn();

// cal.sum(10).difference(5).multiply(5).getValue();
