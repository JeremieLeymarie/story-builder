import { BuilderPosition } from "@/lib/storage/domain";

// TODO: unit tests
export const addPositions = (
  ...positions: BuilderPosition[]
): BuilderPosition => {
  if (positions.length < 2)
    throw new Error(
      "Invalid input: there should be at be at least two positions to add",
    );
  return positions.reduce(
    (acc, position) => ({ x: acc.x + position.x, y: acc.y + position.y }),
    {
      x: 0,
      y: 0,
    },
  );
};

// TODO: unit tests
export const subtractPositions = (
  ...positions: BuilderPosition[]
): BuilderPosition => {
  if (positions.length < 2)
    throw new Error(
      "Invalid input: there should be at be at least two positions to subtract",
    );
  return positions
    .slice(1)
    .reduce(
      (acc, position) => ({ x: acc.x - position.x, y: acc.y - position.y }),
      {
        x: positions[0]!.x,
        y: positions[0]!.y,
      },
    );
};
