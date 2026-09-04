import { expect, test, type Page } from "@playwright/test";
import fixture from "../__fixtures__/identity.json" with { type: "json" };

const navigateToPassphrase = async (page: Page): Promise<void> => {
    await page.goto("/");
    await page.getByRole("link", { name: "Enter a Secret Passphrase" }).click();

    await page.waitForURL("**/wallet/passphrase");
};

test.describe("Wallet - From Entropy", () => {
    test("should generate a wallet", async ({ page }) => {
        await page.goto("/");
        await page.getByRole("link", { name: "Create a New Wallet" }).click();

        await page.waitForURL("**/wallet/entropy");

        await page.waitForURL("**/wallet", { timeout: 30_000 });

        await expect(page.locator("#w-address")).toHaveText(/^[a-zA-Z0-9]{34}$/);
        await expect(page.locator("#w-entropy")).toHaveText(/^[a-f0-9]{32}$/);
        await expect(page.locator("#w-publicKey")).toHaveText(/^[0-9a-f]{66}$/);
        await expect(page.locator("#w-wif")).toHaveText(/^[a-zA-Z0-9]{52}$/);
    });
});

test.describe("Wallet - From Passphrase", () => {
    test("should fail if no passphrase is given", async ({ page }) => {
        await navigateToPassphrase(page);

        await page.getByRole("button", { name: "Generate" }).click();

        await expect(page.getByText("Please Fill out the Passphrase.")).toBeVisible();
    });

    test("should generate a wallet (bip39)", async ({ page }) => {
        await navigateToPassphrase(page);

        await page
            .locator("#wallet-passphrase")
            .fill("size another stool celery ball secret burden giant alter gravity jacket brief");
        await page.getByRole("button", { name: "Generate" }).click();

        await page.waitForURL("**/wallet");

        await expect(page.locator("#w-address")).toContainText("PMRSAVhEQYs5jzTNh28BH5o5ANfUNRGrzM");
        await expect(page.locator("#w-entropy")).toContainText("c9e1335992811f8507a30d076cc1dc0d");
        await expect(page.locator("#w-publicKey")).toContainText(
            "039387c299adb4c9f7ba532934d3e210eb21d374cb285926d3d49c8c71e18bc4de",
        );
        await expect(page.locator("#w-wif")).toContainText("SBic9QRyBxVw5xeacLocLiULN6NYy9o93tmizq2WcESgJM4EzyvK");
    });

    test("should generate a wallet (no bip39)", async ({ page }) => {
        await navigateToPassphrase(page);

        await page.locator("#wallet-passphrase").fill(fixture.passphrase);
        await page.getByRole("button", { name: "Generate" }).click();

        await expect(page.getByText("The Passphrase does not Appear to be BIP39")).toBeVisible();

        await page.getByRole("button", { name: "Generate Anyway" }).click();

        await page.waitForURL("**/wallet");

        await expect(page.locator("#w-address")).toContainText(fixture.data.address);
        await expect(page.locator("#w-publicKey")).toContainText(fixture.data.publicKey);
        await expect(page.locator("#w-wif")).toContainText(fixture.data.wif);
    });
});
