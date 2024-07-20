import { describe, test, expect } from "vitest";
import { capitalize } from "./string";

describe("capitalize", () => {
  test("empty string", () => {
    expect(capitalize("")).toEqual("");
  });

  test("all CAPS", () => {
    expect(capitalize("BABABA")).toEqual("BABABA");
  });

  test("all lowercase", () => {
    expect(capitalize("bababa")).toEqual("Bababa");
  });

  test("only one char", () => {
    expect(capitalize("b")).toEqual("B");
  });

  test("only two chars", () => {
    expect(capitalize("ba")).toEqual("Ba");
  });

  test("already capitalized", () => {
    expect(capitalize("Bababa")).toEqual("Bababa");
  });

  test("weird case", () => {
    expect(capitalize("bABabA")).toEqual("BABabA");
  });
});
