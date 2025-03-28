// 1. Write a JAVAScript/Python program  - Define 4x4 matrix and sum diagonally - Output left diagonal sum , Right Diagonal Sum

const matrix_values = `// 1, 2, 3, 4,
// 5, 6, 7 ,8,
// 9, 10, 11,12,
// 13, 14, 15 ,16`;

const parsedMatrixValues = matrix_values
  .replaceAll("/", "")
  .split(",")
  .map((i) => +i.trim());
console.log("parsed array", parsedMatrixValues);

const resultArray = [];
const size = 4;
let index = 0;

for (let i = 1; i <= size; i++) {
  const arr = [];
  for (let j = 1; j <= size; j++) {
    arr.push(parsedMatrixValues[index]);
    index++;
  }
  resultArray.push(arr);
}

console.log("Matrix :-");
console.log(resultArray);

// [
//   [ 1, 2, 3, 4 ],
//   [ 5, 6, 7, 8 ],
//   [ 9, 10, 11, 12 ],
//   [ 13, 14, 15, 16 ]
// ]

let leftDialogSum = 0;
let rightDialogSum = 0;
for (let i = 0; i < resultArray.length; i++) {
  for (let j = 0; j < resultArray[i].length; j++) {
    if (i === j) {
      leftDialogSum += resultArray[i][j];
    }

    if (resultArray[i].length - 1 - i === j) {
      rightDialogSum += resultArray[j][i];
    }
  }
}

console.log(
  "leftDiagonalSum :",
  leftDialogSum,
  "RightDiagonalSum :",
  rightDialogSum
);
