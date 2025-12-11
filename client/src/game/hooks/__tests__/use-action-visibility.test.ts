import { describe, expect, test } from "vitest";
import { renderHook } from "@testing-library/react";
import { useActionVisibility } from "../use-action-visibility";
import { getTestFactory } from "@/lib/testing/factory";
import { nanoid } from "nanoid";

const factory = getTestFactory();

describe("use-action-visibility", () => {
  test("simple actions are always visible", () => {
    const { result } = renderHook(() =>
      useActionVisibility({
        action: { type: "simple", text: "tutu" },
        progress: factory.storyProgress({ history: [] }),
      }),
    );

    expect(result.current).toBe(true);
  });

  test("simple actions are always visible in test mode", () => {
    const { result } = renderHook(() =>
      useActionVisibility({
        action: { type: "simple", text: "tutu" },
        progress: null,
      }),
    );

    expect(result.current).toBe(true);
  });

  test("conditional actions are never visible in test mode", () => {
    const { result } = renderHook(() =>
      useActionVisibility({
        action: {
          type: "conditional",
          text: "tutu",
          condition: { type: "user-did-not-visit", sceneKey: "" },
        },
        progress: null,
      }),
    );

    expect(result.current).toBe(false);
  });

  describe("[user-did-visit] conditional actions", () => {
    test("page was not visited", () => {
      const { result: resultEmptyHistory } = renderHook(() =>
        useActionVisibility({
          action: {
            type: "conditional",
            text: "tutu",
            condition: { type: "user-did-visit", sceneKey: "fake-key" },
          },
          progress: factory.storyProgress({ history: [] }),
        }),
      );

      expect(resultEmptyHistory.current).toBe(false);

      const { result: resultFullHistory } = renderHook(() =>
        useActionVisibility({
          action: {
            type: "conditional",
            text: "tutu",
            condition: { type: "user-did-visit", sceneKey: "fake-key" },
          },
          progress: factory.storyProgress({ history: [nanoid(), nanoid()] }),
        }),
      );

      expect(resultFullHistory.current).toBe(false);
    });

    test("page was visited", () => {
      const { result } = renderHook(() =>
        useActionVisibility({
          action: {
            type: "conditional",
            text: "tutu",
            condition: { type: "user-did-visit", sceneKey: "fake-key" },
          },
          progress: factory.storyProgress({
            history: [nanoid(), "fake-key", nanoid()],
          }),
        }),
      );

      expect(result.current).toBe(true);
    });
  });

  describe("[user-did-not-visit] conditional actions", () => {
    test("page was visited", () => {
      const { result } = renderHook(() =>
        useActionVisibility({
          action: {
            type: "conditional",
            text: "tutu",
            condition: { type: "user-did-not-visit", sceneKey: "fake-key" },
          },
          progress: factory.storyProgress({
            history: [nanoid(), "fake-key", nanoid()],
          }),
        }),
      );

      expect(result.current).toBe(false);
    });

    test("page was not visited", () => {
      const { result: resultEmptyHistory } = renderHook(() =>
        useActionVisibility({
          action: {
            type: "conditional",
            text: "tutu",
            condition: { type: "user-did-not-visit", sceneKey: "fake-key" },
          },
          progress: factory.storyProgress({ history: [] }),
        }),
      );

      expect(resultEmptyHistory.current).toBe(true);

      const { result: resultFullHistory } = renderHook(() =>
        useActionVisibility({
          action: {
            type: "conditional",
            text: "tutu",
            condition: { type: "user-did-not-visit", sceneKey: "fake-key" },
          },
          progress: factory.storyProgress({ history: [nanoid(), nanoid()] }),
        }),
      );

      expect(resultFullHistory.current).toBe(true);
    });
  });
});
