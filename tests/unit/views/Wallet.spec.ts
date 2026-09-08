import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import Wallet from "@/views/Wallet.vue";
import { walletDummy as walletDummy } from "../../__fixtures__/wallet";

const createWalletRouter = () =>
    createRouter({
        history: createWebHistory(),
        routes: [
            { path: "/", name: "home", component: { render: () => null } },
            { path: "/wallet", name: "wallet", component: Wallet },
        ],
    });

const mountWallet = async () => {
    const router = createWalletRouter();

    router.push({ name: "wallet", state: { wallet: JSON.stringify(walletDummy) } });
    await router.isReady();

    return mount(Wallet, {
        global: {
            plugins: [router],
            stubs: { qrcode: true },
        },
    });
};

const stubClipboard = () => {
    const writeText = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined);

    Object.defineProperty(window.navigator, "clipboard", { value: { writeText }, configurable: true });

    return writeText;
};

afterEach(() => {
    vi.useRealTimers();
    window.history.replaceState(null, "", "/");
});

describe("Wallet.vue", () => {
    it("displays the wallet address", async () => {
        expect((await mountWallet()).find("#w-address").text()).toContain(walletDummy.address);
    });

    it("displays the wallet entropy", async () => {
        expect((await mountWallet()).find("#w-entropy").text()).toContain(walletDummy.entropy);
    });

    it("displays the wallet public key", async () => {
        expect((await mountWallet()).find("#w-publicKey").text()).toContain(walletDummy.publicKey);
    });

    it("displays the wallet wif", async () => {
        expect((await mountWallet()).find("#w-wif").text()).toContain(walletDummy.wif);
    });

    it("renders the passphrase in a grid", async () => {
        const wrapper = await mountWallet();

        expect(wrapper.findAll(".passphrase-grid > div")).toHaveLength(walletDummy.passphrase.split(" ").length);
    });

    it("passes the bare address to the address QR", async () => {
        const wrapper = await mountWallet();
        const value = wrapper.findAll("qrcode-stub")[0].attributes("value");

        expect(value).toBe(walletDummy.address);
        expect(value).toBe(wrapper.find("#w-address").text());
        expect(value).not.toContain("{");
    });

    it("passes the bare passphrase to the passphrase QR", async () => {
        const wrapper = await mountWallet();
        const value = wrapper.findAll("qrcode-stub")[1].attributes("value");

        expect(value).toBe(walletDummy.passphrase);
        expect(value).not.toContain("{");
    });

    it("labels the copy buttons", async () => {
        const wrapper = await mountWallet();

        expect(wrapper.find("#address-copy").attributes("aria-label")).toBeTruthy();
        expect(wrapper.find("#passphrase-copy").attributes("aria-label")).toBeTruthy();
    });

    /* The installed animate.css is 4.x, where every class carries the `animate__` prefix. The
       unprefixed v3 names the template used to bind resolved to nothing at all. */
    it.each(["#address-copy", "#passphrase-copy"])(
        "wobbles %s while copying and clears the classes afterwards",
        async (selector) => {
            stubClipboard();

            const wrapper = await mountWallet();

            vi.useFakeTimers();

            await wrapper.find(selector).trigger("click");
            await vi.advanceTimersByTimeAsync(0);
            await nextTick();

            expect(wrapper.find(`${selector} svg`).classes()).toEqual(
                expect.arrayContaining(["animate__animated", "animate__wobble"]),
            );

            await vi.advanceTimersByTimeAsync(1000);
            await nextTick();

            expect(wrapper.find(`${selector} svg`).classes()).not.toContain("animate__animated");
            expect(wrapper.find(`${selector} svg`).classes()).not.toContain("animate__wobble");
        },
    );

    it("renders the security notice", async () => {
        const wrapper = await mountWallet();

        expect(wrapper.text()).toContain("This passphrase is the only way to recover the funds.");
    });

    it("redirects to the home page if the wallet is not present", async () => {
        const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

        const router = createWalletRouter();

        await mount(Wallet, { global: { plugins: [router] } });
        await flushPromises();

        expect(router.currentRoute.value.name).toBe("home");

        consoleSpy.mockRestore();
    });
});
