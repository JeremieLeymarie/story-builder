import { describe, expect, test } from "vitest";
import { formatDurationHHMMSS } from "../date";

describe("date", () => {
  describe("formatDurationHHMMSS", () => {
    test("formats zero duration", () => {
      expect(formatDurationHHMMSS(0)).toBe("00:00:00");
    });

    test("formats a duration shorter than one minute", () => {
      expect(formatDurationHHMMSS(9_000)).toBe("00:00:09");
    });

    test("formats a duration longer than one hour", () => {
      expect(formatDurationHHMMSS(3_726_000)).toBe("01:02:06");
    });
  });
});
