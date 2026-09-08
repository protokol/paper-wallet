import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import Modal from "@/components/Modal.vue";
import { config } from "@/config";

const setStoredConfig = (values: Record<string, string>): void => {
    localStorage.clear();

    for (const [key, value] of Object.entries(values)) {
        localStorage.setItem(`paper-wallet.${key}`, value);
    }
};

const mountModal = async () => {
    const wrapper = mount(Modal, { props: { isOpen: false }, attachTo: document.body });

    await wrapper.setProps({ isOpen: true });

    return wrapper;
};

enableAutoUnmount(afterEach);

beforeEach(() => {
    setStoredConfig({ token: "protokol", network: "devnet", name: "Protokol", addressPrefix: "55", wif: "170" });
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe("Modal.vue", () => {
    it("emits close on Escape", async () => {
        const wrapper = await mountModal();

        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

        expect(wrapper.emitted("close")).toHaveLength(1);
    });

    it("emits close when the close button is activated", async () => {
        const wrapper = await mountModal();

        await wrapper.get('[aria-label="Close"]').trigger("click");

        expect(wrapper.emitted("close")).toHaveLength(1);
    });

    it("exposes dialog semantics", async () => {
        const wrapper = await mountModal();

        const dialog = wrapper.get('[role="dialog"]');

        expect(dialog.attributes("aria-modal")).toBe("true");
        expect(wrapper.get(`#${dialog.attributes("aria-labelledby")}`).text()).toBe("Select a Network");
    });

    it("gives every control a type and an accessible name", async () => {
        const wrapper = await mountModal();

        expect(wrapper.get("label[for='modal-network']").text()).toBe("Network");

        for (const button of wrapper.findAll("button")) {
            expect(button.attributes("type")).toBe("button");
            expect(button.text() || button.attributes("aria-label")).toBeTruthy();
        }
    });

    it("labels the custom network inputs with their valid range", async () => {
        const wrapper = await mountModal();

        await wrapper.get("button.inline-link").trigger("click");

        expect(wrapper.get("label[for='modal-address-prefix']").text()).toBe("Address prefix");
        expect(wrapper.get("label[for='modal-wif']").text()).toBe("WIF");
        expect(wrapper.get("#modal-address-prefix").attributes("min")).toBe("0");
        expect(wrapper.get("#modal-address-prefix").attributes("max")).toBe("255");
        expect(wrapper.get("#modal-wif").attributes("min")).toBe("0");
        expect(wrapper.get("#modal-wif").attributes("max")).toBe("255");
        expect(wrapper.text()).toContain("0–255");
    });

    it("initialises the select from the saved config", async () => {
        setStoredConfig({ token: "ark", network: "mainnet", name: "ARK", addressPrefix: "23", wif: "170" });

        const wrapper = await mountModal();
        const select = wrapper.get("select").element as HTMLSelectElement;

        expect(select.options[select.selectedIndex].textContent?.trim()).toBe("ARK | Mainnet");
    });

    it("re-reads the saved config every time it opens", async () => {
        const wrapper = await mountModal();

        expect((wrapper.get("select").element as HTMLSelectElement).selectedIndex).toBe(0);

        await wrapper.setProps({ isOpen: false });

        setStoredConfig({ token: "ark", network: "devnet", name: "ARK", addressPrefix: "30", wif: "170" });

        await wrapper.setProps({ isOpen: true });

        const select = wrapper.get("select").element as HTMLSelectElement;

        expect(select.options[select.selectedIndex].textContent?.trim()).toBe("ARK | Devnet");
    });

    it("saves an existing network", async () => {
        const setName = vi.spyOn(config, "setName").mockImplementation(() => undefined);
        const setToken = vi.spyOn(config, "setToken").mockImplementation(() => undefined);
        const setNetwork = vi.spyOn(config, "setNetwork").mockImplementation(() => undefined);

        const wrapper = await mountModal();
        const select = wrapper.get("select");

        // The options carry object values, so the selection is made by index rather than by value.
        (select.element as HTMLSelectElement).selectedIndex = 1;

        await select.trigger("change");
        await wrapper.get("button.light-button").trigger("click");

        expect(setName).toHaveBeenCalledWith("Nascar");
        expect(setToken).toHaveBeenCalledWith("nascar");
        expect(setNetwork).toHaveBeenCalledWith("devnet");
        expect(wrapper.emitted("close")).toHaveLength(1);
    });

    it("saves a custom network", async () => {
        const setName = vi.spyOn(config, "setName").mockImplementation(() => undefined);
        const setAddressPrefix = vi.spyOn(config, "setAddressPrefix").mockImplementation(() => undefined);
        const setWIF = vi.spyOn(config, "setWIF").mockImplementation(() => undefined);

        const wrapper = await mountModal();

        await wrapper.get("button.inline-link").trigger("click");
        await wrapper.get("#modal-address-prefix").setValue("30");
        await wrapper.get("#modal-wif").setValue("170");
        await wrapper.get("button.light-button").trigger("click");

        expect(setName).toHaveBeenCalledWith("Custom");
        expect(setAddressPrefix).toHaveBeenCalledWith(30);
        expect(setWIF).toHaveBeenCalledWith(170);
        expect(wrapper.emitted("close")).toHaveLength(1);
    });

    it("shows an error when custom fields are empty", async () => {
        const wrapper = await mountModal();

        await wrapper.get("button.inline-link").trigger("click");
        await wrapper.get("button.light-button").trigger("click");

        expect(wrapper.get(".alert").text()).toBe("Please Fill out the Address Prefix and Wif.");
        expect(wrapper.emitted("close")).toBeUndefined();
    });

    it("restores the previously focused element on close", async () => {
        const trigger = document.createElement("button");
        document.body.appendChild(trigger);
        trigger.focus();

        const wrapper = await mountModal();

        expect(document.activeElement).not.toBe(trigger);
        expect(wrapper.get('[role="dialog"]').element.contains(document.activeElement)).toBe(true);

        await wrapper.setProps({ isOpen: false });

        expect(document.activeElement).toBe(trigger);

        trigger.remove();
    });

    it("locks and restores body scroll", async () => {
        const wrapper = await mountModal();

        expect(document.body.style.overflow).toBe("hidden");

        await wrapper.setProps({ isOpen: false });

        expect(document.body.style.overflow).toBe("");
    });
});
