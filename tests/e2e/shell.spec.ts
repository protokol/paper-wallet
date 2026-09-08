import { expect, test } from "@playwright/test";

test.describe("Shell", () => {
    test("should expose a single app root", async ({ page }) => {
        await page.goto("/");

        expect(await page.locator("#app").count()).toBe(1);
    });

    test("should keep the primary action above the fold", async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto("/");

        const box = await page.getByRole("link", { name: "Create a New Wallet" }).boundingBox();

        expect(box!.y).toBeLessThan(700);
    });
});
