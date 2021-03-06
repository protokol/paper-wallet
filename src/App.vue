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

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { config } from "@/config";
import { Watch } from "vue-property-decorator";
import Modal from "@/components/Modal.vue";

@Component({
    components: {
        Modal,
    },
})
export default class App extends Vue {
    private isOpen: boolean = false;
    private isHome: boolean = true;
    private isGenerating: boolean = false;
    private network: string | null = null;

    @Watch("$route")
    public onPropertyChanged(value: string, oldValue: string): void {
        this.isHomeRoute();
        this.isEntropyRoute();
        this.refreshNetwork();
    }

    public mounted(): void {
        this.isHomeRoute();
        this.refreshNetwork();
    }

    public backToHome(): void {
        this.$router.push({ name: "home" });
    }

    public openSettings(): void {
        this.isOpen = true;
    }

    public closeSettings(): void {
        this.isOpen = false;
        this.refreshNetwork();
    }

    private refreshNetwork(): void {
        const network: string = config.getNetwork();
        const name: string = config.getName();

        this.network =
            name === "Custom" ? `${name}` : `${name} | ${network.charAt(0).toUpperCase() + network.slice(1)}`;
    }

    private isHomeRoute(): void {
        this.isHome = this.$router.currentRoute.name === "home";
    }

    private isEntropyRoute(): void {
        this.isGenerating = this.$router.currentRoute.name === "entropy";
    }
}
</script>

<style lang="stylus">
#content {
    margin-top 2%;
    background-image: url('assets/img/background.svg');
    background-size: 34%;
    background-position: center top;
}

.underline-none {
 text-decoration none;
}
</style>
