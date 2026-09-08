import { expect, test } from "@playwright/test";

test.describe("Wallet - Print", () => {
    test("should not clip the passphrase when printing", async ({ page }) => {
        await page.goto("/");
        await page.getByRole("link", { name: "Create a New Wallet" }).click();
        await page.waitForURL("**/wallet", { timeout: 30_000 });

        await page.emulateMedia({ media: "print" });

        const clipped = await page.evaluate(() => {
            const grid = document.querySelector(".passphrase-grid")!;
            return grid.scrollHeight > Math.ceil(grid.getBoundingClientRect().height) + 1;
        });

        expect(clipped).toBe(false);
    });
});
