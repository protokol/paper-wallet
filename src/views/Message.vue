<template>
    <div v-if="message" class="bg-surface rounded-lg mt-10 px-6 sm:px-10 py-6 lg:px-16 lg:py-10 max-w-2xl">
        <div class="flex flex-col wallet-property-row">
            <span>Message</span>
            <span class="font-semibold text-sm break-words wallet-value">{{ message.message }}</span>
        </div>
        <div class="flex flex-col wallet-property-row py-6">
            <span>Public Key</span>
            <span class="font-semibold text-sm break-words wallet-value">{{ message.publicKey }}</span>
        </div>
        <div class="flex flex-col pt-6">
            <span>Signature</span>
            <span class="font-semibold text-sm break-words wallet-value">{{ message.signature }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import type { ISignedMessage } from "@/message";

const router = useRouter();

const message = ref<ISignedMessage | null>(null);

onMounted(() => {
    try {
        const serialized = window.history.state?.message;

        if (typeof serialized === "string") {
            message.value = JSON.parse(serialized) as ISignedMessage;
            return;
        }

        router.push("/");
    } catch {
        router.push("/");
    }
});
</script>

<style scoped>
@reference "tailwindcss";
/* Colour comes through the design token rather than @apply, exactly as in Wallet.vue:
   `@reference "tailwindcss"` resolves utilities against the stock theme, so the project's
   own colours are not reachable from @apply here. */
.wallet-property-row {
    border-bottom-color: var(--color-line);
    @apply border-b border-dashed pb-6;
}

/* `anywhere` rather than `break-word`: it also zeroes the min-content width, so a long
   signature cannot push the card wider than a 390px viewport. */
.wallet-value {
    overflow-wrap: anywhere;
}
</style>
