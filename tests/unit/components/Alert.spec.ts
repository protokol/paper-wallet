import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Alert from "@/components/Alert.vue";

type AlertType = "error" | "success" | "info" | "warn";

const mountAlert = (props: { message: string; type?: AlertType }) => mount(Alert, { props });

describe("Alert.vue", () => {
    it("renders the message", () => {
        expect(mountAlert({ message: "Please Fill out the Passphrase." }).text()).toContain(
            "Please Fill out the Passphrase.",
        );
    });

    it("applies the error variant", () => {
        expect(mountAlert({ message: "boom", type: "error" }).classes()).toContain("alert-error");
    });

    it("applies the success variant", () => {
        expect(mountAlert({ message: "yay", type: "success" }).classes()).toContain("alert-success");
    });

    it("applies the info variant", () => {
        expect(mountAlert({ message: "fyi", type: "info" }).classes()).toContain("alert-info");
    });

    it("applies the warn variant", () => {
        expect(mountAlert({ message: "careful", type: "warn" }).classes()).toContain("alert-warn");
    });

    it("defaults to the info variant", () => {
        expect(mountAlert({ message: "fyi" }).classes()).toContain("alert-info");
    });

    it("exposes role=alert", () => {
        expect(mountAlert({ message: "boom", type: "error" }).attributes("role")).toBe("alert");
    });

    it("forwards an id so a field can reference it with aria-describedby", () => {
        const wrapper = mount(Alert, {
            props: { message: "boom", type: "error" },
            attrs: { id: "message-sign-error" },
        });

        expect(wrapper.attributes("id")).toBe("message-sign-error");
    });
});
