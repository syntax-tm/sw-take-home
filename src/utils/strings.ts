/**
 * Converts an integer (1 to 3999) into a Roman numeral.
 * @param num The integer to convert.
 * @returns The Roman numeral string.
 */
export const intToRoman = (num: number): string => {
  if (num <= 0 || num > 3999) {
    throw new RangeError("Roman numerals traditionally only support numbers from 1 to 3999.");
  }

  // map of decimal values to Roman numeral characters (including subtractive combinations)
  // TODO: this could be revised to automatically calculate the subtractive combinations instead of hardcoding them
  const conversionTable: [number, string][] = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"]
  ];

  let romanNumeral = "";

  for (const [decimal, roman] of conversionTable) {
    // Determine how many times the current symbol fits into the remaining number
    const count = Math.floor(num / decimal);

    if (count > 0) {
      romanNumeral += roman.repeat(count);
      num -= count * decimal; // Reduce the number by the amount processed
    }

    // Early exit if the number has been fully converted
    if (num === 0) break;
  }

  return romanNumeral;
};