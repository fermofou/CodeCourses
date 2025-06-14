import { describe, it, expect } from "vitest";
import { cn } from "../src/lib/utils"; // adjust path if needed

describe("cn utility", () => {
  it("should merge static class names", () => {
    expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
  });

  it("should handle conditional class names", () => {
    expect(cn("p-4", false && "hidden", "text-lg")).toBe("p-4 text-lg");
  });

  it("should merge Tailwind conflict classes correctly", () => {
    expect(cn("p-2", "p-4")).toBe("p-4"); // tailwind-merge keeps the last
  });

  it("should work with arrays and nested values", () => {
    expect(cn(["flex", ["items-center", false && "hidden"]])).toBe(
      "flex items-center"
    );
  });
});
