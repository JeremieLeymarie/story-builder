import { act, render, renderHook, screen } from "@testing-library/react";
import { useState } from "react";
import { z } from "zod";

import { useSafeLocalStorage } from "../use-safe-local-storage";
import { beforeEach, describe, expect, test } from "vitest";

const LS_KEY = "blip";
const LS_VALUE = JSON.stringify({ bloup: "blap" });

const schema = z
  .object({ bloup: z.string().catch("blip") })
  .catch({ bloup: "blip" });

describe("use-safe-local-storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("Initializes with fallback values when nothing is in LS", () => {
    const { result } = renderHook(() => useSafeLocalStorage(LS_KEY, schema));
    const [state] = result.current;

    expect(state).toStrictEqual({ bloup: "blip" });
  });

  test("Initializes with value from LS", () => {
    localStorage.setItem(LS_KEY, LS_VALUE);
    const { result } = renderHook(() => useSafeLocalStorage(LS_KEY, schema));
    const [state] = result.current;

    expect(state).toStrictEqual({ bloup: "blap" });
  });

  test("Initializes with string value from LS", () => {
    const stringSchema = z.string().catch("plouf");
    localStorage.setItem("plif", "paf");
    const { result: stringResult } = renderHook(() =>
      useSafeLocalStorage("plif", stringSchema),
    );
    expect(stringResult.current[0]).toBe("paf");
  });

  test("Updates value", () => {
    localStorage.setItem(LS_KEY, LS_VALUE);
    const { result } = renderHook(() => useSafeLocalStorage(LS_KEY, schema));
    const [state, setState] = result.current;
    expect(state).toStrictEqual({ bloup: "blap" });

    // Update
    act(() => {
      setState({ bloup: "blip" });
    });

    expect(result.current[0]).toStrictEqual({ bloup: "blip" });
    expect(JSON.parse(localStorage.getItem(LS_KEY) ?? "{}")).toStrictEqual({
      bloup: "blip",
    });
  });

  test("Updates value using callback", () => {
    localStorage.setItem(LS_KEY, LS_VALUE);
    const { result } = renderHook(() => useSafeLocalStorage(LS_KEY, schema));
    const [state, setState] = result.current;
    expect(state).toStrictEqual({ bloup: "blap" });

    // Update
    act(() => {
      setState((prev) => ({ ...prev, bloup: "blip" }));
    });

    expect(result.current[0]).toStrictEqual({ bloup: "blip" });
    expect(JSON.parse(localStorage.getItem(LS_KEY) ?? "{}")).toStrictEqual({
      bloup: "blip",
    });
  });

  test("Updates value from other hook call", () => {
    // Initial LS values
    localStorage.setItem(LS_KEY, LS_VALUE);
    localStorage.setItem("zwing", JSON.stringify({ zwog: "zwag" }));

    // Hooks
    const { result } = renderHook(() => useSafeLocalStorage(LS_KEY, schema));
    const { result: secondHookResult } = renderHook(() =>
      useSafeLocalStorage(LS_KEY, schema),
    );
    const otherSchema = z
      .object({ zwog: z.string().catch("zwug") })
      .catch({ zwog: "zwug" });
    const { result: otherKeyHookResult } = renderHook(() =>
      useSafeLocalStorage("zwing", otherSchema),
    );

    // Test initial values
    expect(result.current[0]).toStrictEqual({ bloup: "blap" });
    expect(secondHookResult.current[0]).toStrictEqual({ bloup: "blap" });
    expect(otherKeyHookResult.current[0]).toStrictEqual({ zwog: "zwag" });

    // Update hook 1
    act(() => {
      result.current[1]((prev) => ({ ...prev, bloup: "blip" })); // == setState
    });

    // Test updated values
    expect(result.current[0]).toStrictEqual({ bloup: "blip" });
    expect(secondHookResult.current[0]).toStrictEqual({ bloup: "blip" });
    expect(otherKeyHookResult.current[0]).toStrictEqual({ zwog: "zwag" });
    expect(JSON.parse(localStorage.getItem(LS_KEY) ?? "{}")).toStrictEqual({
      bloup: "blip",
    });
  });

  test("Parses or not values depending of schema", () => {
    const stringSchema = z.string().catch("plouf");
    const { result: stringResult } = renderHook(() =>
      useSafeLocalStorage("plif", stringSchema),
    );
    const { result: objectResult } = renderHook(() =>
      useSafeLocalStorage(LS_KEY, schema),
    );

    expect(stringResult.current[0]).toStrictEqual("plouf");
    expect(objectResult.current[0]).toStrictEqual({ bloup: "blip" });
  });

  test("Does not update state when new value is the same as current", () => {
    localStorage.setItem(LS_KEY, LS_VALUE);

    let renderCount = 0;
    const { result } = renderHook(() => {
      renderCount++;
      return useSafeLocalStorage(LS_KEY, schema);
    });
    const initialRenderCount = renderCount;

    act(() => {
      window.dispatchEvent(new StorageEvent("local-storage", { key: LS_KEY }));
    });

    expect(renderCount).toBe(initialRenderCount);
    expect(result.current[0]).toStrictEqual({ bloup: "blap" });
  });

  // TODO: install @testing-library/jest-dom and un-skip this test
  test.skip("Returns new value when key changes", () => {
    localStorage.setItem("blip", JSON.stringify({ bloup: "blap" }));
    localStorage.setItem("tutu", JSON.stringify({ bloup: "toto" }));

    const Container = () => {
      const [key, setKey] = useState("blip");
      const [value, _] = useSafeLocalStorage(key, schema);

      return (
        <div>
          <button onClick={() => setKey("tutu")}>Click me</button>
          <p data-testid="value">{value.bloup}</p>
        </div>
      );
    };

    render(<Container />);

    // expect(screen.getByTestId("value")).toHaveTextContent("blap");
    // Change LS key
    act(() => {
      screen.getByRole("button").click();
    });
    // expect(screen.getByTestId("value")).toHaveTextContent("toto");
  });
});
