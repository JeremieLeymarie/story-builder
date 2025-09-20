import { describe, expect, test } from "vitest";
import { Vec2 } from "../vec2";

describe("vec2", () => {
  describe("add", () => {
    test("one vector", () => {
      const vector = new Vec2(42, 42);
      expect(vector.add(new Vec2(1, 2))).toStrictEqual(new Vec2(43, 44));
    });
    test("multiple vectors", () => {
      const vector = new Vec2(42, 42);
      expect(vector.add(new Vec2(1, 2), new Vec2(3, 4))).toStrictEqual(
        new Vec2(46, 48),
      );
    });
    test("negative result", () => {
      const vector = new Vec2(42, 42);
      expect(vector.add(new Vec2(-84, 2))).toStrictEqual(new Vec2(-42, 44));
    });
    test("vector 0 0", () => {
      const vector = new Vec2(42, 42);
      expect(vector.add(Vec2.ZERO)).toStrictEqual(vector);
    });
    test("infinity", () => {
      const vector = new Vec2(42, 42);
      expect(vector.add(Vec2.INFINITY)).toStrictEqual(Vec2.INFINITY);
    });
    test("negative infinity", () => {
      const vector = new Vec2(42, 42);
      expect(vector.add(Vec2.NEG_INFINITY)).toStrictEqual(Vec2.NEG_INFINITY);
    });
  });

  describe("subtract", () => {
    test("one vector", () => {
      const vector = new Vec2(42, 42);
      expect(vector.subtract(new Vec2(1, 2))).toStrictEqual(new Vec2(41, 40));
    });
    test("multiple vectors", () => {
      const vector = new Vec2(42, 42);
      expect(vector.subtract(new Vec2(1, 2), new Vec2(3, 4))).toStrictEqual(
        new Vec2(38, 36),
      );
    });
    test("negative result", () => {
      const vector = new Vec2(42, 42);
      expect(vector.subtract(new Vec2(84, -2))).toStrictEqual(
        new Vec2(-42, 44),
      );
    });
    test("zero", () => {
      const vector = new Vec2(42, 42);
      expect(vector.subtract(Vec2.ZERO)).toStrictEqual(vector);
    });
    test("infinity", () => {
      const vector = new Vec2(42, 42);
      expect(vector.subtract(Vec2.INFINITY)).toStrictEqual(Vec2.NEG_INFINITY);
    });
    test("negative infinity", () => {
      const vector = new Vec2(42, 42);
      expect(vector.subtract(Vec2.NEG_INFINITY)).toStrictEqual(Vec2.INFINITY);
    });
  });

  describe("distance", () => {
    test("zero", () => {
      const a = new Vec2(42, 42);
      const b = new Vec2(42, 42);
      expect(Vec2.distance(a, b)).toStrictEqual(0);
    });

    test("simple", () => {
      const a = new Vec2(42, 42);
      const b = new Vec2(37, 30);
      expect(Vec2.distance(a, b)).toStrictEqual(13);
    });

    test("infinity", () => {
      const a = new Vec2(42, 42);
      const b = Vec2.INFINITY;
      expect(Vec2.distance(a, b)).toStrictEqual(Infinity);
    });

    test("negative infinity", () => {
      const a = new Vec2(42, 42);
      const b = Vec2.NEG_INFINITY;
      expect(Vec2.distance(a, b)).toStrictEqual(Infinity);
    });
  });
});
