import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const css = readFileSync("src/assets/css/tailwind.css", "utf8");

describe("design tokens", () => {
    it.each([
        "--color-brand-600",
        "--color-brand-700",
        "--color-ink",
        "--color-ink-muted",
        "--color-surface",
        "--color-surface-sunken",
        "--color-page",
        "--color-line",
        "--color-danger",
        "--color-success",
        "--color-focus",
    ])("defines %s", (token) => {
        expect(css).toContain(token);
    });
});
