import { describe, expect, test } from "vitest";
import { getIsColorDark } from "../colors";

describe("colors", () => {
  describe("isColorDark", () => {
    test("invalid color code", () => {
      expect(() => getIsColorDark("tutu")).toThrow();
      expect(() => getIsColorDark("25283D")).toThrow();
      expect(() => getIsColorDark("#25283Z")).toThrow();
      expect(() => getIsColorDark("255,255,255")).toThrow();
    });

    test("dark colors", () => {
      const DARK_COLORS = [
        "#25283D",
        "#19231A",
        "#CC3F0C",
        "#426A5A",
        "#55505C",
        "#5B507A",
      ];

      DARK_COLORS.forEach((color) => {
        expect(getIsColorDark(color)).toBeTruthy();
      });
    });

    test("light colors", () => {
      const LIGHT_COLORS = [
        "#9EADC8",
        "#B9E28C",
        "#D6D84F",
        "#E3E36A",
        "#CBFF8C",
        "#C16200",
      ];

      LIGHT_COLORS.forEach((color) => {
        expect(getIsColorDark(color)).toBeFalsy();
      });
    });
  });
});
