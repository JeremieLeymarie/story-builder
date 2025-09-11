export const randomNumber = (min: number, max: number) => {
  if (min > max)
    throw new Error("Invalid range: minimum should be less than maximum");
  const minimum = Math.ceil(min);
  const maximum = Math.floor(max);

  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
};

export const randomInArray = <T>(array: T[]) => {
  if (!array.length)
    throw new Error(
      "Invalid input: array should consist of at least one element",
    );
  const index = randomNumber(0, array.length - 1);
  return array[index]!;
};
