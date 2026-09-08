import { expect, test, type Page } from "@playwright/test";
import fixture from "../__fixtures__/message.json" with { type: "json" };

const BIP39_PASSPHRASE = "size another stool celery ball secret burden giant alter gravity jacket brief";

const navigateToPassphrase = async (page: Page): Promise<void> => {
    await page.goto("/");
    await page.getByRole("link", { name: "Enter a Secret Passphrase" }).click();

    await page.waitForURL("**/wallet/passphrase");
};

const navigateToSign = async (page: Page): Promise<void> => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sign or Verify a Message" }).click();
    await page.getByRole("link", { name: "Sign Message" }).click();

    await page.waitForURL("**/message/sign");
};

const navigateToVerify = async (page: Page): Promise<void> => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sign or Verify a Message" }).click();
    await page.getByRole("link", { name: "Verify Message" }).click();

    await page.waitForURL("**/message/verify");
};

test.describe("Forms - Submitting with Enter", () => {
    test("should generate a wallet when pressing Enter", async ({ page }) => {
        await navigateToPassphrase(page);

        await page.locator("#wallet-passphrase").fill(BIP39_PASSPHRASE);
        await page.locator("#wallet-passphrase").press("Enter");

        await page.waitForURL("**/wallet");

        await expect(page.locator("#w-address")).toContainText("PMRSAVhEQYs5jzTNh28BH5o5ANfUNRGrzM");
    });

    test("should sign a message when pressing Enter", async ({ page }) => {
        await navigateToSign(page);

        await page.locator("#message-message").fill(fixture.data.message);
        await page.locator("#message-passphrase").fill(BIP39_PASSPHRASE);
        await page.locator("#message-passphrase").press("Enter");

        await page.waitForURL("**/message");

        await expect(page.getByText(fixture.data.message)).toBeVisible();
    });

    test("should validate the verify form when pressing Enter", async ({ page }) => {
        await navigateToVerify(page);

        await page.locator("#message-message").fill(fixture.data.message);
        await page.locator("#message-message").press("Enter");

        await expect(page.getByRole("alert")).toHaveText("Please Fill out the PublicKey.");
    });
});

test.describe("Forms - Labels", () => {
    test("should label the passphrase field", async ({ page }) => {
        await navigateToPassphrase(page);

        await expect(page.getByLabel("Secret passphrase")).toHaveAttribute("id", "wallet-passphrase");
    });

    test("should label every field of the sign form", async ({ page }) => {
        await navigateToSign(page);

        await expect(page.getByLabel("Message")).toHaveAttribute("id", "message-message");
        await expect(page.getByLabel("Passphrase")).toHaveAttribute("id", "message-passphrase");
    });

    test("should label every field of the verify form", async ({ page }) => {
        await navigateToVerify(page);

        await expect(page.getByLabel("Message")).toHaveAttribute("id", "message-message");
        await expect(page.getByLabel("Public key")).toHaveAttribute("id", "message-publicKey");
        await expect(page.getByLabel("Signature")).toHaveAttribute("id", "message-signature");
    });
});

test.describe("Forms - Error announcement", () => {
    test("should announce the error and focus the invalid field on the passphrase form", async ({ page }) => {
        await navigateToPassphrase(page);

        await page.getByRole("button", { name: "Generate" }).click();

        await expect(page.getByRole("alert")).toHaveCount(1);
        await expect(page.getByRole("alert")).toHaveText("Please Fill out the Passphrase.");
        await expect(page.getByRole("alert")).toHaveAttribute("id", "wallet-passphrase-error");

        await expect(page.locator("#wallet-passphrase")).toBeFocused();
        await expect(page.locator("#wallet-passphrase")).toHaveAttribute("aria-invalid", "true");
        await expect(page.locator("#wallet-passphrase")).toHaveAttribute("aria-describedby", "wallet-passphrase-error");
    });

    test("should announce the error and focus the invalid field on the sign form", async ({ page }) => {
        await navigateToSign(page);

        await page.locator("#message-message").fill(fixture.data.message);
        await page.getByRole("button", { name: "Sign" }).click();

        await expect(page.getByRole("alert")).toHaveCount(1);
        await expect(page.getByRole("alert")).toHaveText("Please Fill out the Passphrase.");

        await expect(page.locator("#message-passphrase")).toBeFocused();
        await expect(page.locator("#message-passphrase")).toHaveAttribute("aria-describedby", "message-sign-error");
        await expect(page.locator("#message-message")).not.toHaveAttribute("aria-invalid", "true");
    });

    test("should announce the error and focus the invalid field on the verify form", async ({ page }) => {
        await navigateToVerify(page);

        await page.getByRole("button", { name: "Verify" }).click();

        await expect(page.getByRole("alert")).toHaveCount(1);
        await expect(page.getByRole("alert")).toHaveText("Please Fill out the Message.");

        await expect(page.locator("#message-message")).toBeFocused();
        await expect(page.locator("#message-message")).toHaveAttribute("aria-describedby", "message-verify-error");
    });
});

test.describe("Forms - Escape hatches", () => {
    test("should keep Generate Anyway out of the submit path", async ({ page }) => {
        await navigateToPassphrase(page);

        await page.locator("#wallet-passphrase").fill("this is a top secret passphrase");
        await page.locator("#wallet-passphrase").press("Enter");

        await expect(page.getByText("The Passphrase does not Appear to be BIP39")).toBeVisible();
        await expect(page.getByRole("button", { name: "Generate Anyway" })).toHaveAttribute("type", "button");

        await page.getByRole("button", { name: "Generate Anyway" }).click();

        await page.waitForURL("**/wallet");
    });

    test("should keep Sign Anyway out of the submit path", async ({ page }) => {
        await navigateToSign(page);

        await page.locator("#message-message").fill(fixture.data.message);
        await page.locator("#message-passphrase").fill(fixture.passphrase);
        await page.locator("#message-passphrase").press("Enter");

        await expect(page.getByText("The Passphrase does not Appear to be BIP39")).toBeVisible();
        await expect(page.getByRole("button", { name: "Sign Anyway" })).toHaveAttribute("type", "button");

        await page.getByRole("button", { name: "Sign Anyway" }).click();

        await expect(page.getByText(fixture.data.signature)).toBeVisible();
    });
});
