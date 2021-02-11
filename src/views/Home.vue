<template>
    <div class="home">
        <div v-if="!showMessageButtons" class="flex flex-col sm:flex-row flex-wrap mt-5 mb-5">
            <router-link
                class="primary-action-button mb-5 sm:mb-0 sm:mr-5 whitespace-no-wrap"
                :to="{ name: 'wallet:entropy' }"
                >Create a New Wallet</router-link
            >

            <router-link class="light-button whitespace-no-wrap" :to="{ name: 'wallet:passphrase' }"
                >Enter a Secret Passphrase</router-link
            >
        </div>

        <div v-else class="flex flex-col sm:flex-row flex-wrap mt-5 mb-5">
            <router-link
                class="primary-action-button mb-5 sm:mb-0 sm:mr-5 whitespace-no-wrap"
                :to="{ name: 'message:sign' }"
                >Sign Message</router-link
            >

            <router-link class="light-button whitespace-no-wrap" :to="{ name: 'message:verify' }"
                >Verify Message</router-link
            >
        </div>

        <button class="text-gray-500 inline-link" @click="toggle()" type="button">{{ toggleMessage }}</button>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class App extends Vue {
    public toggleMessage: string = "Sign or Verify a Message";
    public showMessageButtons: boolean = false;

    public toggle(): void {
        this.showMessageButtons = !this.showMessageButtons;
        this.showMessageButtons
            ? (this.toggleMessage = "Generate or Import a Wallet")
            : (this.toggleMessage = "Sign or Verify a Message");
    }
}
</script>
