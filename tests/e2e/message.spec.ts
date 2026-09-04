import { expect, test, type Page } from "@playwright/test";
import fixture from "../__fixtures__/message.json" with { type: "json" };

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

test.describe("Message - Sign", () => {
    test("should fail if no message is given", async ({ page }) => {
        await navigateToSign(page);

        await page.getByRole("button", { name: "Sign" }).click();

        await expect(page.getByText("Please Fill out the Message.")).toBeVisible();
    });

    test("should fail if no passphrase is given", async ({ page }) => {
        await navigateToSign(page);

        await page.locator("#message-message").fill(fixture.data.message);
        await page.getByRole("button", { name: "Sign" }).click();

        await expect(page.getByText("Please Fill out the Passphrase.")).toBeVisible();
    });

    test("should fail for a non-BIP39 passphrase and allow signing anyway", async ({ page }) => {
        await navigateToSign(page);

        await page.locator("#message-message").fill(fixture.data.message);
        await page.locator("#message-passphrase").fill(fixture.passphrase);
        await page.getByRole("button", { name: "Sign" }).click();

        await expect(page.getByText("The Passphrase does not Appear to be BIP39")).toBeVisible();

        await page.getByRole("button", { name: "Sign Anyway" }).click();

        await expect(page.getByText(fixture.data.publicKey)).toBeVisible();
        await expect(page.getByText(fixture.data.signature)).toBeVisible();
    });

    test("should sign a message (bip39)", async ({ page }) => {
        await navigateToSign(page);

        await page.locator("#message-message").fill(fixture.data.message);
        await page
            .locator("#message-passphrase")
            .fill("size another stool celery ball secret burden giant alter gravity jacket brief");
        await page.getByRole("button", { name: "Sign" }).click();

        await expect(page.getByText(fixture.data.message)).toBeVisible();
        await expect(
            page.getByText("039387c299adb4c9f7ba532934d3e210eb21d374cb285926d3d49c8c71e18bc4de"),
        ).toBeVisible();
        await expect(
            page.getByText(
                "30450221008baa804110ab7282cf4411f76b6367aaefd8eba230b98ddd82eaa2abb2880cde022044f03e60bccd78a33a2f763bbef11d764a53338e930989c66686853056623036",
            ),
        ).toBeVisible();
    });

    test("should verify a valid message", async ({ page }) => {
        await navigateToVerify(page);

        await page.locator("#message-message").fill(fixture.data.message);
        await page.locator("#message-publicKey").fill(fixture.data.publicKey);
        await page.locator("#message-signature").fill(fixture.data.signature);
        await page.getByRole("button", { name: "Verify" }).click();

        await expect(page.getByText("The Message has been Successfully Verified.")).toBeVisible();
    });

    test("should reject an invalid message", async ({ page }) => {
        await navigateToVerify(page);

        await page.locator("#message-message").fill("different message");
        await page.locator("#message-publicKey").fill(fixture.data.publicKey);
        await page.locator("#message-signature").fill(fixture.data.signature);
        await page.getByRole("button", { name: "Verify" }).click();

        await expect(page.getByText("The Message could not be Verified.")).toBeVisible();
    });
});
