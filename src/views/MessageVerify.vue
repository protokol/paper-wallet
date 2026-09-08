<template>
    <div class="w-full">
        <form
            class="mx-auto mt-5 flex w-full max-w-5xl flex-col items-stretch gap-5 sm:flex-row sm:flex-wrap sm:items-end sm:justify-center"
            @submit.prevent="verifyMessageAction"
        >
            <div class="flex w-full flex-col sm:w-48">
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
                <label class="field-label" for="message-publicKey">Public key</label>
                <input
                    id="message-publicKey"
                    ref="publicKeyInput"
                    v-model="publicKey"
                    v-bind="errorAttrs('publicKey')"
                    type="text"
                    class="field-input font-mono"
                    placeholder="Enter your public key"
                />
            </div>

            <div class="flex w-full flex-col sm:w-96">
                <label class="field-label" for="message-signature">Signature</label>
                <input
                    id="message-signature"
                    ref="signatureInput"
                    v-model="signature"
                    v-bind="errorAttrs('signature')"
                    type="text"
                    class="field-input font-mono"
                    placeholder="Enter your Signature"
                />
            </div>

            <button class="primary-action-button w-full sm:w-auto" type="submit">Verify</button>
        </form>

        <div class="mx-auto flex max-w-xl flex-col items-center">
            <Alert :id="ERROR_ID" :message="errorText" type="error" v-if="errorText" />

            <Alert message="The Message has been Successfully Verified." type="success" v-if="isValid === true" />

            <Alert message="The Message could not be Verified." type="error" v-if="isValid === false" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { nextTick, ref, type Ref } from "vue";
import Alert from "@/components/Alert.vue";
import { verifyMessage } from "@/message";

type FieldName = "message" | "publicKey" | "signature";

const ERROR_ID = "message-verify-error";

const message = ref("");
const publicKey = ref("");
const signature = ref("");
const isValid = ref<boolean | null>(null);
const errorText = ref<string | null>(null);
const invalidField = ref<FieldName | null>(null);

const messageInput = ref<HTMLInputElement | null>(null);
const publicKeyInput = ref<HTMLInputElement | null>(null);
const signatureInput = ref<HTMLInputElement | null>(null);

const inputs: Record<FieldName, Ref<HTMLInputElement | null>> = {
    message: messageInput,
    publicKey: publicKeyInput,
    signature: signatureInput,
};

const errorAttrs = (field: FieldName): Record<string, string> =>
    invalidField.value === field ? { "aria-invalid": "true", "aria-describedby": ERROR_ID } : {};

const failWith = (field: FieldName, text: string): void => {
    errorText.value = text;
    invalidField.value = field;

    // A validation error replaces the previous verification result. Without this reset the stale
    // "could not be Verified" alert stays on screen next to the new one, leaving two live regions.
    isValid.value = null;

    void nextTick(() => inputs[field].value?.focus());
};

const verifyMessageAction = (): void => {
    if (!message.value) {
        failWith("message", "Please Fill out the Message.");
        return;
    }

    if (!publicKey.value) {
        failWith("publicKey", "Please Fill out the PublicKey.");
        return;
    }

    if (!signature.value) {
        failWith("signature", "Please Fill out the Signature.");
        return;
    }

    errorText.value = null;
    invalidField.value = null;

    isValid.value = verifyMessage({
        message: message.value,
        publicKey: publicKey.value,
        signature: signature.value,
    });
};
</script>
