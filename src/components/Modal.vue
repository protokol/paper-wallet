<template>
    <div v-if="isOpen">
        <div class="modal-backdrop" @click="close()" />
        <div class="modal-content">
            <div class="modal-top">
                <span class="font-bold text-2xl">Select a Network</span>
                <span>Choose the Network to use for the paper Wallet</span>
                <img src="@/assets/img/globe.png" />
            </div>
            <div class="modal-bottom">
                <div v-if="!useCustom">
                    <span class="mr-3 block w-full text-sm font-bold text-gray-500">Network</span>
                    <div class="flex items-center">
                        <div class="inline-block relative w-full sm:w-4/5 mr-3">
                            <select
                                v-model="selectedToken"
                                class="hover:border-gray-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 container-inputs"
                            >
                                <option v-for="token in tokens" :value="token.value" :key="token.label">
                                    {{ token.label }}
                                </option>
                            </select>
                            <div
                                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
                            >
                                <svg
                                    class="fill-current h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                                    />
                                </svg>
                            </div>
                        </div>

                        <button class="light-button font-bold sm:w-1/5" @click.prevent="saveConfigFromNetwork">
                            Save
                        </button>
                    </div>
                    <span class="text-xs inline-link" @click="toggleCustom(true)">Want to use a Custom Network?</span>
                </div>
                <div v-else>
                    <span class="mr-3 block w-full text-sm font-bold text-gray-500">Network</span>
                    <div class="flex">
                        <div class="flex mr-4 container-inputs">
                            <input
                                type="number"
                                v-model="customAddressPrefix"
                                placeholder="Address Prefix"
                                class="w-2/4 mr-4"
                            />

                            <input type="number" v-model="customWIF" placeholder="WIF" class="w-2/4" />
                        </div>

                        <button class="light-button font-bold w-1/5" @click.prevent="saveConfigFromCustom">Save</button>
                    </div>
                    <span class="text-xs inline-link" @click="toggleCustom(false)"
                        >Want to use an Existing Network?</span
                    >
                </div>
                <Alert :message="error" type="error" v-if="error" />
            </div>

            <div class="modal-close-button" @click="close">
                <svg width="15" height="15" viewBox="0 0 15 15" class="fill-current">
                    <path
                        d="M1764,6323.5l-1.5-1.5-6,6-6-6-1.5,1.5,6,6-6,6,1.5,1.5,6-6,6,6,1.5-1.5-6-6Z"
                        transform="translate(-1749 -6322)"
                    />
                </svg>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { config } from "@/config";
import Alert from "@/components/Alert.vue";

interface ITokenOption {
    label: string;
    value: { token: string; network: string };
}

defineProps<{ isOpen: boolean }>();

const emit = defineEmits<{ close: [] }>();

const tokens = ref<ITokenOption[]>([]);
const selectedToken = ref<ITokenOption["value"]>({ token: "protokol", network: "devnet" });
const customAddressPrefix = ref<number | null>(null);
const customWIF = ref<number | null>(null);
const useCustom = ref(false);
const error = ref<string | null>(null);

onMounted(() => {
    for (const token of Object.values(config.getTokens())) {
        for (const network of Object.keys(token.networks)) {
            tokens.value.push({
                label: `${token.name} | ${network.charAt(0).toUpperCase() + network.slice(1)}`,
                value: { token: token.name, network },
            });
        }
    }

    useCustom.value = config.getName() === "Custom";

    if (useCustom.value) {
        customAddressPrefix.value = config.getAddressPrefix();
        customWIF.value = config.getWIF();
    }

    selectedToken.value = tokens.value[0].value;
});

const saveConfigFromNetwork = (): void => {
    config.setName(selectedToken.value.token);
    config.setToken(selectedToken.value.token.toLowerCase());
    config.setNetwork(selectedToken.value.network);

    close();
};

const saveConfigFromCustom = (): void => {
    if (customAddressPrefix.value && customWIF.value) {
        config.setName("Custom");
        config.setAddressPrefix(customAddressPrefix.value);
        config.setWIF(customWIF.value);

        close();
    } else {
        error.value = "Please Fill out the Address Prefix and Wif.";
    }
};

const close = (): void => {
    emit("close");
};

const toggleCustom = (value: boolean): void => {
    useCustom.value = value;
};
</script>

<style>
@reference "tailwindcss";
.modal-top {
    background-color: #2d2f38;
    @apply flex flex-col rounded-t-lg p-10 text-white;
}

.modal-top img {
    width: 8rem;
    @apply mt-3 self-center;
}

.modal-bottom {
    @apply bg-white rounded-b-lg p-10;
}

.modal-content {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    @apply fixed rounded-lg overflow-auto z-10;
}

@variant sm {
    .modal-content {
        max-width: 30rem;
        @apply w-full;
    }

    .modal-top img {
        width: 12rem;
    }
}

.modal-backdrop {
    background-color: rgba(0, 0, 0, 0.4);
    @apply w-screen h-screen fixed left-0 top-0 z-10 overflow-hidden;
}

.modal-close-button {
    top: 10px;
    right: 10px;
    @apply absolute text-white cursor-pointer;
}

@variant sm {
    /* Inputs */
    .container-inputs {
        min-width: 311px !important;
    }
}

/* Existing Networks */
select {
    @apply block appearance-none w-full bg-white border border-gray-400 px-4 py-2 pr-8 rounded-sm shadow-sm leading-tight;
}

/* Custom Networks */
input[type="number"] {
    appearance: none;
    @apply bg-white py-2 border-b-2 border-gray-500 rounded-none;
    outline-color: #429ef5;
}

/* Shared */
select:focus,
input[type="number"]:focus {
    border-color: #2585ff;
}
</style>
