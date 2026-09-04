<template>
    <div v-if="message" class="bg-white rounded-lg mt-10 px-6 sm:px-10 py-6 lg:px-16 lg:py-10 max-w-2xl">
        <div class="flex flex-col wallet-property-row">
            <span>Message</span>
            <span class="font-semibold text-sm break-all">{{ message.message }}</span>
        </div>
        <div class="flex flex-col wallet-property-row py-6">
            <span>Public Key</span>
            <span class="font-semibold text-sm break-all">{{ message.publicKey }}</span>
        </div>
        <div class="flex flex-col pt-6">
            <span>Signature</span>
            <span class="font-semibold text-sm break-all">{{ message.signature }}</span>
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

<style>
.wallet-property-row {
    @apply border-b border-dashed border-gray-400 pb-6;
}
</style>
