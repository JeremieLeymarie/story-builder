/**
 * Splits an array in multiple chunks
 * @param array
 * @example
 * const chunked = chunk([1, 2, 3, 4, 5], 2);
 * assert chunked === [[1, 2], [3, 4], [5]];
 */
export const chunk = <T>(array: T[], chunkSize: number): T[][] => {
  if (chunkSize < 0 || !Number.isSafeInteger(chunkSize))
    throw new Error("Chunk size should be a positive integer");
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};
