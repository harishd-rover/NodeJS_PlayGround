import { argv } from "node:process";
import fs from "node:fs"

function formatNumber(input, begin, divider) {
  const length = input.length;

  let formattedNumber = "";
  let j = 0; // index for the formatted string
  let commaCount = length % 3; // determine where the first divider should be placed

  // Add begin sign at the beginning
  formattedNumber = begin;
  j = j + 1;

  // Iterate over the original string from the beginning
  for (let i = 0; i < length; i++) {
    formattedNumber += input[i];
    j = j + 1;

    // Add a divider every three digits, but not after the last digit
    if (commaCount > 0 && i < length - 1 && (i + 1) % 3 == commaCount) {
      formattedNumber += divider;
    } else if (commaCount == 0 && i < length - 1 && (i + 1) % 3 == 0) {
      formattedNumber += divider;
    }
  }

  return formattedNumber;
}

const outputFile = fs.createWriteStream(argv[2]);
let number = "";
let index = 0;

process.stdin.on("data", (input) => {
  const str = input.toString();
  for (let c of str) {
    // Accumulate the digits until we completely read one number
    if (c != " ") {
      number += c;
      index++;
    }

    if (c == " ") {
      if (index > 0) {
        // Format the number that we just read
        let formattedNumber = formatNumber(number, argv[3][0], argv[4][0]);

        // Write to our destination stream
        if (!outputFile.write(" " + formattedNumber + " ")) {
          process.stdin.pause();
        }

        // Resetting...
        number = "";
        index = 0;
      }
    }
  }
});

outputFile.on("drain", () => {
  process.stdin.resume();
});

process.stdin.on("end", () => {
  outputFile.end();
});
