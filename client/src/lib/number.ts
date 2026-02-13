// See: https://stackoverflow.com/a/11832950/17456270
export const round = (num: number, decimalPlaces = 2) => {
  const divider = 10 ** decimalPlaces;
  return Math.round((num + Number.EPSILON) * divider) / divider;
};

/**
 * Compare two floats approximately
 * @param floatA the first float
 * @param floatB the second float
 * @param {Object} options the options
 * @param {number} options.decimalPrecision the number of decimal places for the approximation of equality
 * @returns
 */
const areFloatsEqual = (
  floatA: number,
  floatB: number,
  { decimalPrecision = 2 }: { decimalPrecision?: number } = {},
) => {
  if (!Number.isInteger(decimalPrecision) || decimalPrecision <= 0)
    throw new Error("Precision must be a positive integer");

  return round(floatA, decimalPrecision) === round(floatB, decimalPrecision);
};

export const N = { areFloatsEqual };
