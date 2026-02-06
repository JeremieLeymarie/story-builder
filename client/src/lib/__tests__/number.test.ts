import { describe, expect, test } from "vitest";
import { N } from "../number";

describe("areFloatsEqual", () => {
  test("1 and 1 are equal", () => {
    expect(N.areFloatsEqual(1, 1)).toBeTruthy();
  });

  test("1.1 and 1.1 are equal", () => {
    expect(N.areFloatsEqual(1.1, 1.1)).toBeTruthy();
  });

  test("1.01 and 1.01 are equal", () => {
    expect(N.areFloatsEqual(1.01, 1.01)).toBeTruthy();
  });

  test("1.012 and 1.012 are equal", () => {
    expect(N.areFloatsEqual(1.012, 1.012)).toBeTruthy();
  });

  test("1 and 1.001 are equal", () => {
    expect(N.areFloatsEqual(1, 1.001)).toBeTruthy();
  });

  test("-1.1 and -1.1 are equal", () => {
    expect(N.areFloatsEqual(-1.1, -1.1)).toBeTruthy();
  });

  test("1.012 and 1.013 are equal with standard precision", () => {
    expect(N.areFloatsEqual(1.012, 1.013)).toBeTruthy();
  });

  test("1.012 and 1.013 are equal with standard precision", () => {
    expect(N.areFloatsEqual(1.012, 1.013)).toBeTruthy();
  });

  test("1 and 2 are not equal", () => {
    expect(N.areFloatsEqual(1, 2)).toBeFalsy();
  });

  test("1.1 and 1.2 are not equal", () => {
    expect(N.areFloatsEqual(1.1, 1.2)).toBeFalsy();
  });

  test("1.12 and 1.13 are not equal", () => {
    expect(N.areFloatsEqual(1.12, 1.13)).toBeFalsy();
  });

  test("1.012 and 1.013 are not equal with 3 places precision", () => {
    expect(N.areFloatsEqual(1.012, 1.013, { decimalPrecision: 3 })).toBeFalsy();
  });

  test("1 and -1 are not equal", () => {
    expect(N.areFloatsEqual(1, -1)).toBeFalsy();
  });

  test("negative precision is not allowed", () => {
    expect(() =>
      N.areFloatsEqual(1, 1, { decimalPrecision: -1 }),
    ).toThrowError();
  });

  test("float precision is not allowed", () => {
    expect(() =>
      N.areFloatsEqual(1, 1, { decimalPrecision: 1.1 }),
    ).toThrowError();
  });
});
