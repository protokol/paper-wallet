<template>
    <div class="w-full">
        <form
            class="mx-auto mt-5 flex w-full max-w-xl flex-col items-stretch gap-5 sm:flex-row sm:flex-wrap sm:items-end sm:justify-center"
            @submit.prevent="generateWallet"
        >
            <div class="flex w-full flex-col sm:w-96">
                <label class="field-label" for="wallet-passphrase">Secret passphrase</label>
                <input
                    id="wallet-passphrase"
                    ref="passphraseInput"
                    v-model="passphrase"
                    v-bind="errorAttrs"
                    type="text"
                    class="field-input"
                    placeholder="Enter your Passphrase"
                    autocomplete="off"
                />
            </div>

            <button class="primary-action-button w-full sm:w-auto" type="submit">Generate</button>
        </form>

        <div class="mx-auto flex max-w-xl flex-col items-center" v-if="errorText">
            <Alert :id="ERROR_ID" :message="errorText" type="error" />
            <button class="text-ink-muted inline-link mt-3" type="button" @click.prevent="forceGenerateWallet">
                Generate Anyway
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { useRouter } from "vue-router";
import { validateMnemonic, walletFromBIP39 } from "@/crypto";
import Alert from "@/components/Alert.vue";

const ERROR_ID = "wallet-passphrase-error";

const router = useRouter();

const passphrase = ref("");
const errorText = ref<string | null>(null);
const passphraseInput = ref<HTMLInputElement | null>(null);

const errorAttrs = computed((): Record<string, string> =>
    errorText.value ? { "aria-invalid": "true", "aria-describedby": ERROR_ID } : {},
);

const failWith = (text: string): void => {
    errorText.value = text;

    void nextTick(() => passphraseInput.value?.focus());
};

const generateWallet = (): void => {
    if (!passphrase.value) {
        failWith("Please Fill out the Passphrase.");
        return;
    }

    if (!validateMnemonic(passphrase.value)) {
        failWith("The Passphrase does not Appear to be BIP39");
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
