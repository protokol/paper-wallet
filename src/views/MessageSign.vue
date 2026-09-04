<template>
    <div class="w-full sm:w-auto">
        <div class="flex flex-col sm:flex-row sm:justify-start items-center wallet-from-passphrase mt-5">
            <input
                type="text"
                placeholder="Enter your Message"
                v-model="message"
                class="custom-border p-4 w-full sm:w-auto sm:mr-5 mb-5"
                id="message-message"
            />

            <input
                type="password"
                placeholder="Enter your Passphrase"
                v-model="passphrase"
                class="custom-border p-4 w-full sm:w-auto sm:mr-5 mb-5"
                id="message-passphrase"
            />

            <button class="primary-action-button mb-5" @click.prevent="signMessageAction">Sign</button>
        </div>

        <div class="flex flex-col items-center" v-if="errorText">
            <Alert :message="errorText" type="error" />
            <button v-if="showForceSign" class="text-gray-500 inline-link mt-3" @click.prevent="forceSignMessage">
                Sign Anyway
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { validateMnemonic } from "@/crypto";
import Alert from "@/components/Alert.vue";
import { signMessage } from "@/message";

const router = useRouter();

const message = ref("");
const passphrase = ref("");
const errorText = ref<string | null>(null);
const showForceSign = ref(false);

const signMessageAction = (): void => {
    showForceSign.value = false;

    if (!message.value) {
        errorText.value = "Please Fill out the Message.";
        return;
    }

    if (!passphrase.value) {
        errorText.value = "Please Fill out the Passphrase.";
        return;
    }

    if (!validateMnemonic(passphrase.value)) {
        errorText.value = "The Passphrase does not Appear to be BIP39";
        showForceSign.value = true;
        return;
    }

    forceSignMessage();
};

const forceSignMessage = (): void => {
    errorText.value = null;

    router.push({
        name: "message",
        state: { message: JSON.stringify(signMessage(message.value, passphrase.value)) },
    });
};
</script>

<style>
/* Custom Networks */
input[type="text"],
input[type="password"] {
    appearance: none;
    @apply bg-transparent py-2 border-t-0 border-l-0 border-r-0 border-b-2 border-gray-500 rounded-none;
    outline-color: #429ef5;
}

.custom-border {
    @apply border;
    border-color: #429ef5;
}
</style>
