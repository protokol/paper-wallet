<template>
    <div class="home">
        <div v-if="!showMessageButtons" class="flex flex-col sm:flex-row flex-wrap mt-5 mb-5">
            <router-link
                class="primary-action-button mb-5 sm:mb-0 sm:mr-5 whitespace-nowrap"
                :to="{ name: 'wallet:entropy' }"
                >Create a New Wallet</router-link
            >

            <router-link class="light-button whitespace-nowrap" :to="{ name: 'wallet:passphrase' }"
                >Enter a Secret Passphrase</router-link
            >
        </div>

        <div v-else class="flex flex-col sm:flex-row flex-wrap mt-5 mb-5">
            <router-link
                class="primary-action-button mb-5 sm:mb-0 sm:mr-5 whitespace-nowrap"
                :to="{ name: 'message:sign' }"
                >Sign Message</router-link
            >

            <router-link class="light-button whitespace-nowrap" :to="{ name: 'message:verify' }"
                >Verify Message</router-link
            >
        </div>

        <button class="text-gray-500 inline-link" @click="toggle()" type="button">{{ toggleMessage }}</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const toggleMessage = ref("Sign or Verify a Message");
const showMessageButtons = ref(false);

const toggle = (): void => {
    showMessageButtons.value = !showMessageButtons.value;
    toggleMessage.value = showMessageButtons.value ? "Generate or Import a Wallet" : "Sign or Verify a Message";
};
</script>
