<template>
    <div v-if="isOpen">
        <div class="modal-backdrop" @click="close()" />
        <div ref="dialog" class="modal-content" role="dialog" aria-modal="true" :aria-labelledby="headingId">
            <div class="modal-top">
                <div class="flex flex-col">
                    <h2 :id="headingId" class="text-xl">Select a Network</h2>
                    <span class="text-sm mt-2">Choose the Network to use for the paper Wallet</span>
                </div>
                <img src="@/assets/img/globe.png" alt="" />
            </div>

            <div class="modal-bottom">
                <div v-if="!useCustom">
                    <label class="field-label" for="modal-network">Network</label>

                    <div class="flex items-center">
                        <div class="relative w-full mr-3">
                            <select id="modal-network" v-model="chosenNetwork" class="field-input field-select">
                                <option v-for="token in tokens" :value="token.value" :key="token.label">
                                    {{ token.label }}
                                </option>
                            </select>

                            <div class="select-chevron">
                                <svg
                                    class="fill-current h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                                    />
                                </svg>
                            </div>
                        </div>

                        <button
                            type="button"
                            class="light-button font-bold shrink-0"
                            @click.prevent="saveConfigFromNetwork"
                        >
                            Save
                        </button>
                    </div>

                    <button type="button" class="text-xs inline-link inline-block mt-4" @click="toggleCustom(true)">
                        Want to use a Custom Network?
                    </button>
                </div>

                <div v-else>
                    <div class="flex">
                        <div class="w-2/4 mr-4">
                            <label class="field-label" for="modal-address-prefix">Address prefix</label>
                            <input
                                id="modal-address-prefix"
                                v-model="customAddressPrefix"
                                type="number"
                                min="0"
                                max="255"
                                class="field-input"
                            />
                            <span class="field-hint">0–255</span>
                        </div>

                        <div class="w-2/4">
                            <label class="field-label" for="modal-wif">WIF</label>
                            <input
                                id="modal-wif"
                                v-model="customWIF"
                                type="number"
                                min="0"
                                max="255"
                                class="field-input"
                            />
                            <span class="field-hint">0–255</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        class="light-button font-bold w-full mt-4"
                        @click.prevent="saveConfigFromCustom"
                    >
                        Save
                    </button>

                    <button type="button" class="text-xs inline-link inline-block mt-4" @click="toggleCustom(false)">
                        Want to use an Existing Network?
                    </button>
                </div>

                <Alert :message="error" type="error" v-if="error" />
            </div>

            <button type="button" class="modal-close-button" aria-label="Close" @click="close">
                <svg width="15" height="15" viewBox="0 0 15 15" class="fill-current" aria-hidden="true">
                    <path
                        d="M1764,6323.5l-1.5-1.5-6,6-6-6-1.5,1.5,6,6-6,6,1.5,1.5,6-6,6,6,1.5-1.5-6-6Z"
                        transform="translate(-1749 -6322)"
                    />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useTemplateRef, watch } from "vue";
import { config } from "@/config";
import Alert from "@/components/Alert.vue";

interface ITokenOption {
    label: string;
    value: { token: string; network: string };
}

const props = defineProps<{ isOpen: boolean }>();

const emit = defineEmits<{ close: [] }>();

const headingId = "modal-network-heading";

const buildTokenOptions = (): ITokenOption[] => {
    const options: ITokenOption[] = [];

    for (const token of Object.values(config.getTokens())) {
        for (const network of Object.keys(token.networks)) {
            options.push({
                label: `${token.name} | ${network.charAt(0).toUpperCase() + network.slice(1)}`,
                value: { token: token.name, network },
            });
        }
    }

    return options;
};

const tokens = ref<ITokenOption[]>(buildTokenOptions());
const chosenNetwork = ref<ITokenOption["value"]>(tokens.value[0].value);
const customAddressPrefix = ref<number | null>(null);
const customWIF = ref<number | null>(null);
const useCustom = ref(false);
const error = ref<string | null>(null);

const dialog = useTemplateRef<HTMLElement>("dialog");

// Focus trap bookkeeping. The dialog is driven by a prop, so it can open and close many times
// over the lifetime of a single component instance — everything set up here must be undone again.
const focusableSelector = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled])";
let isTrapping = false;
let elementFocusedBeforeOpen: HTMLElement | null = null;
let bodyOverflowBeforeOpen = "";

const getFocusable = (): HTMLElement[] =>
    dialog.value ? Array.from(dialog.value.querySelectorAll<HTMLElement>(focusableSelector)) : [];

const close = (): void => {
    emit("close");
};

const onKeydown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
        event.preventDefault();

        close();

        return;
    }

    if (event.key !== "Tab") {
        return;
    }

    const focusable = getFocusable();

    if (!focusable.length) {
        return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement as HTMLElement | null;
    const isInside = !!active && !!dialog.value?.contains(active);

    if (event.shiftKey && (!isInside || active === first)) {
        event.preventDefault();

        last.focus();
    } else if (!event.shiftKey && (!isInside || active === last)) {
        event.preventDefault();

        first.focus();
    }
};

// The saved configuration — not the first entry in the list — is what the dialog must show.
const syncFromConfig = (): void => {
    error.value = null;
    useCustom.value = config.getName() === "Custom";

    if (useCustom.value) {
        customAddressPrefix.value = config.getAddressPrefix();
        customWIF.value = config.getWIF();
    }

    const savedToken = config.getToken().toLowerCase();
    const savedNetwork = config.getNetwork();

    const saved = tokens.value.find(
        (option) => option.value.token.toLowerCase() === savedToken && option.value.network === savedNetwork,
    );

    chosenNetwork.value = saved ? saved.value : tokens.value[0].value;
};

const trap = async (): Promise<void> => {
    isTrapping = true;
    elementFocusedBeforeOpen = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    bodyOverflowBeforeOpen = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onKeydown);

    await nextTick();

    getFocusable()[0]?.focus();
};

const release = (restoreFocus: boolean): void => {
    if (!isTrapping) {
        return;
    }

    isTrapping = false;

    window.removeEventListener("keydown", onKeydown);
    document.body.style.overflow = bodyOverflowBeforeOpen;

    if (restoreFocus) {
        elementFocusedBeforeOpen?.focus();
    }

    elementFocusedBeforeOpen = null;
};

watch(
    () => props.isOpen,
    async (isOpen) => {
        if (isOpen) {
            syncFromConfig();

            await trap();
        } else {
            release(true);
        }
    },
    { immediate: true },
);

onBeforeUnmount(() => release(false));

const saveConfigFromNetwork = (): void => {
    config.setName(chosenNetwork.value.token);
    config.setToken(chosenNetwork.value.token.toLowerCase());
    config.setNetwork(chosenNetwork.value.network);

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

const toggleCustom = (value: boolean): void => {
    useCustom.value = value;
};
</script>

<style scoped>
@reference "tailwindcss";

/* The design tokens live in src/assets/css/tailwind.css. `@reference "tailwindcss"` only pulls in
   Tailwind's own theme, so token colours are consumed here as custom properties rather than as
   `@apply text-ink-muted`-style utilities, which would not compile inside an SFC style block. */

.modal-top {
    /* Replaces the untokenised #2d2f38. White on --color-ink is 13.51:1. */
    background-color: var(--color-ink);
    @apply flex items-center justify-between rounded-t-lg px-8 py-6 text-white;
}

.modal-top img {
    width: 4rem;
    @apply shrink-0 ml-6;
}

.modal-bottom {
    @apply bg-white rounded-b-lg px-8 py-10;
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
        width: 5rem;
    }
}

.modal-backdrop {
    background-color: rgba(0, 0, 0, 0.4);
    @apply w-screen h-screen fixed left-0 top-0 z-10 overflow-hidden;
}

.modal-close-button {
    top: 10px;
    right: 10px;
    @apply absolute p-1 text-white cursor-pointer;
}

/* The dialog's fields are `.field-label` / `.field-input` / `.field-hint` from
   src/assets/css/_forms.css — the same classes the three form views use. Only the chevron
   overlay, which no other form needs, is defined here. */
.select-chevron {
    color: var(--color-ink-muted);
    @apply pointer-events-none absolute inset-y-0 right-0 flex items-center px-3;
}
</style>
