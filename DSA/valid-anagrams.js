/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function (str1, str2) {
  return myAnagram(str1, str2);
};

const myAnagram = (str1, str2) => {
  if (str1.length !== str2.length) {
    return false;
  }

  const freqMap = new Map();

  for (const i of str1.split("")) {
    if (freqMap.has(i)) {
      freqMap.set(i, freqMap.get(i) + 1);
    } else {
      freqMap.set(i, 1);
    }
  }

  let isInvalid = false;

  for (const i of str2.split("")) {
    if (freqMap.has(i)) {
      if (freqMap.get(i) == 1) {
        freqMap.delete(i);
      } else {
        freqMap.set(i, freqMap.get(i) - 1);
      }
    } else {
      isInvalid = true;
    }
  }
  return !isInvalid && freqMap.size == 0;
};

console.log(isAnagram("anagram", "nagaram"));
