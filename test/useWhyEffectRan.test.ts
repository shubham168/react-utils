// @vitest-environment jsdom

import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useWhyEffectRan } from "../src/useWhyEffectRan"; // Adjust path as needed

describe("useWhyEffectRan", () => {
  beforeEach(() => {
    // Spy on console methods and suppress their output during tests
    vi.spyOn(console, "group").mockImplementation(() => {});
    vi.spyOn(console, "table").mockImplementation(() => {});
    vi.spyOn(console, "groupEnd").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should NOT log anything on initial mount", () => {
    renderHook(({ deps }) => useWhyEffectRan(deps, ["count"]), {
      initialProps: { deps: [0] },
    });

    expect(console.group).not.toHaveBeenCalled();
    expect(console.table).not.toHaveBeenCalled();
  });

  it("should NOT log anything if dependencies do not change on re-render", () => {
    const { rerender } = renderHook(
      ({ deps }) => useWhyEffectRan(deps, ["count"]),
      { initialProps: { deps: [0] } },
    );

    // Re-render with the exact same dependencies
    rerender({ deps: [0] });

    expect(console.group).not.toHaveBeenCalled();
    expect(console.table).not.toHaveBeenCalled();
  });

  it("should log changes with custom names when dependencies change", () => {
    const { rerender } = renderHook(
      ({ deps }) => useWhyEffectRan(deps, ["count", "user"]),
      { initialProps: { deps: [0, "Alice"] } },
    );

    // Trigger change on the first dependency ('count')
    rerender({ deps: [1, "Alice"] });

    expect(console.group).toHaveBeenCalledWith("useEffect re-ran because:");
    expect(console.table).toHaveBeenCalledWith({
      count: { from: 0, to: 1 },
    });
    expect(console.groupEnd).toHaveBeenCalled();
  });

  it("should fallback to index strings if dependencyNames array is not provided", () => {
    const { rerender } = renderHook(
      ({ deps }) => useWhyEffectRan(deps), // No names array passed
      { initialProps: { deps: ["foo", "bar"] } },
    );

    // Trigger change on the second dependency
    rerender({ deps: ["foo", "baz"] });

    expect(console.table).toHaveBeenCalledWith({
      "1": { from: "bar", to: "baz" }, // Fallback to index string "1"
    });
  });

  it("should fallback to index strings if dependencyNames lacks an item for a given index", () => {
    const { rerender } = renderHook(
      ({ deps }) => useWhyEffectRan(deps, ["first"]), // Only 1 name for 2 elements
      { initialProps: { deps: ["a", "b"] } },
    );

    // Change both elements
    rerender({ deps: ["changed-a", "changed-b"] });

    expect(console.table).toHaveBeenCalledWith({
      first: { from: "a", to: "changed-a" },
      "1": { from: "b", to: "changed-b" }, // Index fallback
    });
  });

  it("should catch object reference changes using Object.is comparison", () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 1 }; // Same structural value, different reference pointer

    const { rerender } = renderHook(
      ({ deps }) => useWhyEffectRan(deps, ["config"]),
      { initialProps: { deps: [obj1] } },
    );

    rerender({ deps: [obj2] });

    expect(console.table).toHaveBeenCalledWith({
      config: { from: obj1, to: obj2 },
    });
  });
});
