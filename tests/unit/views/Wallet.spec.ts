import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
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

afterEach(() => {
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

    it("redirects to the home page if the wallet is not present", async () => {
        const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

        const router = createWalletRouter();

        await mount(Wallet, { global: { plugins: [router] } });
        await flushPromises();

        expect(router.currentRoute.value.name).toBe("home");

        consoleSpy.mockRestore();
    });
});
