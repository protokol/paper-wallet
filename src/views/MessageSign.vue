<template>
    <div class="w-full">
        <form
            class="mx-auto mt-5 flex w-full max-w-4xl flex-col items-stretch gap-5 sm:flex-row sm:flex-wrap sm:items-end sm:justify-center"
            @submit.prevent="signMessageAction"
        >
            <div class="flex w-full flex-col sm:w-72">
                <label class="field-label" for="message-message">Message</label>
                <input
                    id="message-message"
                    ref="messageInput"
                    v-model="message"
                    v-bind="errorAttrs('message')"
                    type="text"
                    class="field-input"
                    placeholder="Enter your Message"
                />
            </div>

            <div class="flex w-full flex-col sm:w-72">
                <label class="field-label" for="message-passphrase">Passphrase</label>
                <input
                    id="message-passphrase"
                    ref="passphraseInput"
                    v-model="passphrase"
                    v-bind="errorAttrs('passphrase')"
                    type="password"
                    class="field-input"
                    placeholder="Enter your Passphrase"
                    autocomplete="off"
                />
            </div>

            <button class="primary-action-button w-full sm:w-auto" type="submit">Sign</button>
        </form>

        <div class="mx-auto flex max-w-xl flex-col items-center" v-if="errorText">
            <Alert :id="ERROR_ID" :message="errorText" type="error" />
            <button
                v-if="showForceSign"
                class="text-ink-muted inline-link mt-3"
                type="button"
                @click.prevent="forceSignMessage"
            >
                Sign Anyway
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { nextTick, ref, type Ref } from "vue";
import { useRouter } from "vue-router";
import { validateMnemonic } from "@/crypto";
import Alert from "@/components/Alert.vue";
import { signMessage } from "@/message";

type FieldName = "message" | "passphrase";

const ERROR_ID = "message-sign-error";

const router = useRouter();

const message = ref("");
const passphrase = ref("");
const errorText = ref<string | null>(null);
const showForceSign = ref(false);
const invalidField = ref<FieldName | null>(null);

const messageInput = ref<HTMLInputElement | null>(null);
const passphraseInput = ref<HTMLInputElement | null>(null);

const inputs: Record<FieldName, Ref<HTMLInputElement | null>> = {
    message: messageInput,
    passphrase: passphraseInput,
};

const errorAttrs = (field: FieldName): Record<string, string> =>
    invalidField.value === field ? { "aria-invalid": "true", "aria-describedby": ERROR_ID } : {};

const failWith = (field: FieldName, text: string): void => {
    errorText.value = text;
    invalidField.value = field;

    void nextTick(() => inputs[field].value?.focus());
};

const signMessageAction = (): void => {
    showForceSign.value = false;

    if (!message.value) {
        failWith("message", "Please Fill out the Message.");
        return;
    }

    if (!passphrase.value) {
        failWith("passphrase", "Please Fill out the Passphrase.");
        return;
    }

    if (!validateMnemonic(passphrase.value)) {
        failWith("passphrase", "The Passphrase does not Appear to be BIP39");
        showForceSign.value = true;
        return;
    }

    forceSignMessage();
};

const forceSignMessage = (): void => {
    errorText.value = null;
    invalidField.value = null;

    router.push({
        name: "message",
        state: { message: JSON.stringify(signMessage(message.value, passphrase.value)) },
    });
};
</script>
