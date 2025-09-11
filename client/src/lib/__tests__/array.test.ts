import { describe, expect, test } from "vitest";
import { chunk } from "../array";

describe("array", () => {
  describe("chunk", () => {
    test("negative chunk size", () => {
      expect(() => chunk([1, 2, 3, 4], -2)).toThrowError(
        "Chunk size should be a positive integer",
      );
    });
    test("infinite chunk size", () => {
      expect(() => chunk([1, 2, 3, 4], Infinity)).toThrowError(
        "Chunk size should be a positive integer",
      );
    });
    test("float chunk size", () => {
      expect(() => chunk([1, 2, 3, 4], 3.14)).toThrowError(
        "Chunk size should be a positive integer",
      );
    });
    test("empty array", () => {
      expect(chunk([], 5)).toStrictEqual([]);
    });
    test("one element", () => {
      expect(chunk([1], 2)).toStrictEqual([[1]]);
    });
    test("chunk size of one", () => {
      expect(chunk([1, 2, 3], 1)).toStrictEqual([[1], [2], [3]]);
    });
    test("odd number of elements", () => {
      expect(chunk([1, 2, 3], 2)).toStrictEqual([[1, 2], [3]]);
    });
    test("even number of elements", () => {
      expect(chunk([1, 2, 3, 4], 2)).toStrictEqual([
        [1, 2],
        [3, 4],
      ]);
    });
    test("chunk size bigger than array length", () => {
      expect(chunk([1, 2, 3, 4], 42)).toStrictEqual([[1, 2, 3, 4]]);
    });
  });
});
