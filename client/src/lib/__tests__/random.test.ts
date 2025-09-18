import { describe, expect, test } from "vitest";
import { randomInArray, randomNumber } from "../random";

describe("random", () => {
  describe("randomNumber", () => {
    test("same min and max", () => {
      expect(randomNumber(1, 1)).toBe(1);
    });
    test("negative min", () => {
      const result = randomNumber(-5, 5);
      expect(result).toBeGreaterThanOrEqual(-5);
      expect(result).toBeLessThanOrEqual(5);
    });

    test("negative max", () => {
      const result = randomNumber(-5, -2);
      expect(result).toBeGreaterThanOrEqual(-5);
      expect(result).toBeLessThanOrEqual(-2);
    });
    test("min greater than max", () => {
      expect(() => randomNumber(15, 5)).toThrowError(
        "Invalid range: minimum should be less than maximum",
      );
    });

    test("simple", () => {
      expect(randomNumber(1, 10)).toBeGreaterThanOrEqual(1);
      expect(randomNumber(1, 10)).toBeLessThanOrEqual(10);
    });
  });

  describe("randomInArray", () => {
    test("empty array", () => {
      expect(() => randomInArray([])).toThrowError(
        "Invalid input: array should consist of at least one element",
      );
    });

    test("only one element", () => {
      expect(randomInArray([1])).toBe(1);
    });

    test("simple", () => {
      expect(randomInArray([1, 2, 3])).toBeOneOf([1, 2, 3]);
    });
  });
});
