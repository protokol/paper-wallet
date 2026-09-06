<template>
    <div class="w-full sm:w-auto">
        <div class="flex flex-col sm:flex-row flex-wrap justify-center items-center wallet-from-passphrase mt-5">
            <input
                type="text"
                placeholder="Enter your Message"
                v-model="message"
                class="border p-4 w-full sm:w-auto sm:mr-5 mb-5"
                id="message-message"
            />

            <input
                type="text"
                placeholder="Enter your public key"
                v-model="publicKey"
                class="border p-4 w-full sm:w-auto sm:mr-5 mb-5"
                id="message-publicKey"
            />

            <input
                type="text"
                placeholder="Enter your Signature"
                v-model="signature"
                class="border p-4 w-full sm:w-auto sm:mr-5 mb-5"
                id="message-signature"
            />

            <button class="primary-action-button mb-5" @click.prevent="verifyMessageAction">Verify</button>
        </div>

        <div class="flex flex-col items-center">
            <Alert :message="errorText" type="error" v-if="errorText" />

            <Alert message="The Message has been Successfully Verified." type="success" v-if="isValid === true" />

            <Alert message="The Message could not be Verified." type="error" v-if="isValid === false" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Alert from "@/components/Alert.vue";
import { verifyMessage } from "@/message";

const message = ref("");
const publicKey = ref("");
const signature = ref("");
const isValid = ref<boolean | null>(null);
const errorText = ref<string | null>(null);

const verifyMessageAction = (): void => {
    if (!message.value) {
        errorText.value = "Please Fill out the Message.";
        return;
    }

    if (!publicKey.value) {
        errorText.value = "Please Fill out the PublicKey.";
        return;
    }

    if (!signature.value) {
        errorText.value = "Please Fill out the Signature.";
        return;
    }

    errorText.value = null;

    isValid.value = verifyMessage({
        message: message.value,
        publicKey: publicKey.value,
        signature: signature.value,
    });
};
</script>

<style>
@reference "tailwindcss";
/* Custom Networks */
input[type="text"] {
    appearance: none;
    @apply bg-transparent py-2 border-t-0 border-l-0 border-r-0 border-b-2 border-gray-500 rounded-none;
    outline-color: #429ef5;
}
</style>
