<template>
    <div id="app" class="flex flex-col items-center">
        <div id="content">
            <h1 class="text-center">Protokol Paper Wallet</h1>
            <span class="text-center">Generate Your Own Unique Passphrase and Address</span>

            <router-view />

            <modal :is-open="isOpen" @close="closeSettings()"></modal>

            <div class="flex flex-wrap justify-center items-center mt-10 print-ignore" v-if="!isGenerating">
                <button class="text-gray-500 inline-link mr-4 underline-none" type="button" @click="openSettings()">
                    Choose Network: {{ network }}
                </button>

                <button class="text-gray-500 inline-link" type="button" @click="backToHome()" v-if="!isHome">
                    Back to Home
                </button>
            </div>

            <div class="flex flex-wrap justify-center items-center mt-10 print-ignore" v-else>
                <span>Generating your Passphrase, Hang in there!</span>
            </div>

            <div class="flex flex-col text-gray-500 text-center mt-10 mb-5 print-ignore">
                <span class="text-sm mt-2">
                    Made with ❤️
                    <a class="inline-link" href="https://ark.io" target="_blank">ARK.io</a> |
                    <a class="inline-link" href="https://protokol.com" target="_blank">Protokol.com</a> |
                    <a class="inline-link" href="https://github.com/ArkEcosystem/paper-wallet" target="_blank"
                        >View Source</a
                    >
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { config } from "@/config";
import Modal from "@/components/Modal.vue";

const route = useRoute();
const router = useRouter();

const isOpen = ref(false);

const isHome = computed(() => route.name === "home");
const isGenerating = computed(() => route.name === "wallet:entropy");
const network = ref<string | null>(null);

const refreshNetwork = (): void => {
    const networkName = config.getNetwork();
    const name = config.getName();

    network.value =
        name === "Custom" ? name : `${name} | ${networkName.charAt(0).toUpperCase() + networkName.slice(1)}`;
};

const backToHome = (): void => {
    router.push({ name: "home" });
};

const openSettings = (): void => {
    isOpen.value = true;
};

const closeSettings = (): void => {
    isOpen.value = false;
    refreshNetwork();
};

onMounted(() => refreshNetwork());
</script>

<style>
#content {
    margin-top: 2%;
    background-image: url("assets/img/background.svg");
    background-size: 34%;
    background-position: center top;
}

.underline-none {
    text-decoration: none;
}
</style>
