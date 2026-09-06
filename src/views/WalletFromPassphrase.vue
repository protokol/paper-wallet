<template>
    <div>
        <div class="flex items-center wallet-from-passphrase mt-5">
            <input
                type="text"
                placeholder="Enter your Passphrase"
                v-model="passphrase"
                class="border border-gray-200 p-4 mr-5"
                id="wallet-passphrase"
            />
            <button class="primary-action-button focus:outline-hidden" @click.prevent="generateWallet">Generate</button>
        </div>
        <div class="flex flex-col items-center" v-if="errorText">
            <Alert :message="errorText" type="error" />
            <button class="text-gray-500 inline-link mt-3" @click.prevent="forceGenerateWallet">Generate Anyway</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { validateMnemonic, walletFromBIP39 } from "@/crypto";
import Alert from "@/components/Alert.vue";

const router = useRouter();

const passphrase = ref("");
const errorText = ref<string | null>(null);

const generateWallet = (): void => {
    if (!passphrase.value) {
        errorText.value = "Please Fill out the Passphrase.";
        return;
    }

    if (!validateMnemonic(passphrase.value)) {
        errorText.value = "The Passphrase does not Appear to be BIP39";
        return;
    }

    forceGenerateWallet();
};

const forceGenerateWallet = (): void => {
    errorText.value = null;

    router.push({
        name: "wallet",
        state: { wallet: JSON.stringify(walletFromBIP39(passphrase.value)) },
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
