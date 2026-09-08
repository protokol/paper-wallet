<template>
    <div v-if="wallet">
        <div class="print-ignore mt-10">
            <SecurityNotice variant="screen" />
        </div>

        <div id="wallet-details">
            <input type="hidden" id="wallet-address" :value="wallet.address" />
            <input type="hidden" id="wallet-passphrase" :value="wallet.passphrase" />

            <div class="bg-surface rounded-t-lg mt-4 px-6 sm:px-10 py-6 lg:px-16 lg:py-10">
                <div class="text-center border-b border-dashed border-line pb-3 mb-3">
                    <span class="text-ink-muted">
                        <span class="font-semibold">{{ name }}</span>
                        {{ network }} ({{ date }})
                    </span>
                </div>
                <div class="flex flex-col sm:flex-row items-center wallet-property-row pb-6">
                    <div class="flex flex-col w-full sm:ml-3">
                        <div class="flex items-center">
                            <span>Address</span>
                            <button
                                id="address-copy"
                                aria-label="Copy address"
                                class="print-ignore text-ink-muted ml-3"
                                @click="copyAddress()"
                            >
                                <svg
                                    width="12px"
                                    height="16px"
                                    viewBox="0 0 16 19"
                                    class="fill-current"
                                    aria-hidden="true"
                                    :class="{ 'animate__animated animate__wobble': isAddressCopying }"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M11.000,-0.000 L1.999,-0.000 C0.899,-0.000 -0.000,0.941 -0.000,2.091 L-0.000,13.000 L1.999,13.000 L1.999,2.000 L11.000,2.000 L11.000,-0.000 ZM14.000,3.994 L5.999,3.994 C4.900,3.994 3.999,4.944 3.999,6.106 L3.999,16.888 C3.999,18.049 4.900,19.000 5.999,19.000 L14.000,19.000 C15.099,19.000 16.000,18.049 16.000,16.888 L16.000,6.106 C16.000,4.944 15.099,3.994 14.000,3.994 ZM14.000,17.000 L5.999,17.000 L5.999,6.000 L14.000,6.000 L14.000,17.000 Z"
                                    />
                                </svg>
                            </button>
                        </div>
                        <span class="font-semibold sm:text-lg break-words wallet-value" id="w-address">
                            {{ wallet.address }}
                        </span>
                    </div>
                    <div class="shrink-0 mt-3 sm:mt-0 sm:order-first">
                        <qrcode :value="codeForAddress" :options="{ width: 140, margin: 1 }"></qrcode>
                    </div>
                </div>
                <div class="flex flex-col sm:flex-row items-center pt-6">
                    <div class="flex flex-col w-full sm:ml-3">
                        <div class="flex items-center">
                            <span>Passphrase</span>
                            <button
                                id="passphrase-copy"
                                aria-label="Copy passphrase"
                                class="print-ignore text-ink-muted ml-3"
                                @click="copyPassphrase()"
                            >
                                <svg
                                    width="12px"
                                    height="16px"
                                    viewBox="0 0 16 19"
                                    class="fill-current"
                                    aria-hidden="true"
                                    :class="{ 'animate__animated animate__wobble': isPassphraseCopying }"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M11.000,-0.000 L1.999,-0.000 C0.899,-0.000 -0.000,0.941 -0.000,2.091 L-0.000,13.000 L1.999,13.000 L1.999,2.000 L11.000,2.000 L11.000,-0.000 ZM14.000,3.994 L5.999,3.994 C4.900,3.994 3.999,4.944 3.999,6.106 L3.999,16.888 C3.999,18.049 4.900,19.000 5.999,19.000 L14.000,19.000 C15.099,19.000 16.000,18.049 16.000,16.888 L16.000,6.106 C16.000,4.944 15.099,3.994 14.000,3.994 ZM14.000,17.000 L5.999,17.000 L5.999,6.000 L14.000,6.000 L14.000,17.000 Z"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div class="passphrase-grid mt-2">
                            <div
                                v-for="(word, index) in passphraseWords"
                                :key="`${word}-${index}`"
                                class="relative py-1 px-2 border border-line rounded-sm text-center"
                            >
                                <span>{{ word }}</span>
                                <span class="passphrase-index">{{ index + 1 }}</span>
                            </div>
                        </div>
                        <SecurityNotice variant="print" class="mt-3" />
                    </div>
                    <div class="shrink-0 mt-3 sm:mt-0 sm:order-first">
                        <qrcode :value="codeForPassphrase" :options="{ width: 180, margin: 1 }"></qrcode>
                    </div>
                </div>
            </div>
            <div class="bg-surface-sunken rounded-b-lg px-6 sm:px-10 py-6 lg:px-16 lg:py-10">
                <div class="flex flex-col wallet-property-row" v-if="wallet.entropy">
                    <span>Entropy</span>
                    <span class="font-semibold text-sm break-words wallet-value" id="w-entropy">
                        {{ wallet.entropy }}
                    </span>
                </div>
                <div class="flex flex-col wallet-property-row pb-6" :class="{ 'pt-6': wallet.entropy }">
                    <span>Public Key</span>
                    <span class="font-semibold text-sm break-words wallet-value" id="w-publicKey">
                        {{ wallet.publicKey }}
                    </span>
                </div>
                <div class="flex flex-col pt-6">
                    <span>WIF</span>
                    <span class="font-semibold text-sm break-words wallet-value" id="w-wif">{{ wallet.wif }}</span>
                </div>
            </div>
        </div>

        <span class="sr-only print-ignore" role="status" aria-live="polite">{{ copyStatus }}</span>

        <div class="flex justify-center items-center mt-5 print-ignore">
            <button class="secondary-action-button mr-5" @click="save">
                <span class="mr-3">Save</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="15"
                    viewBox="0 0 12 15"
                    class="fill-current"
                    aria-hidden="true"
                    :class="{ 'animate__animated animate__wobble': isSaving }"
                >
                    <path
                        d="M725.329,1059.71l-0.659-.75a0.5,0.5,0,0,0-.7-0.05L722,1060.64v-7.14a0.5,0.5,0,0,0-.5-0.5h-1a0.5,0.5,0,0,0-.5.5v7.14l-1.965-1.73a0.5,0.5,0,0,0-.7.05l-0.659.75a0.5,0.5,0,0,0,.046.71l3.954,3.46a0.512,0.512,0,0,0,.659,0l3.953-3.46A0.5,0.5,0,0,0,725.329,1059.71ZM726.5,1066h-11a0.5,0.5,0,0,0-.5.5v1a0.5,0.5,0,0,0,.5.5h11a0.5,0.5,0,0,0,.5-0.5v-1A0.5,0.5,0,0,0,726.5,1066Z"
                        transform="translate(-715 -1053)"
                    />
                </svg>
            </button>
            <button class="icon-button" aria-label="Print wallet" @click="print">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="19"
                    viewBox="0 0 21 19"
                    class="fill-current"
                    aria-hidden="true"
                >
                    <path
                        d="M792.118,1060.88A2.88,2.88,0,0,0,790,1060h-1v-3a3.606,3.606,0,0,0-.313-1.38,3.567,3.567,0,0,0-.75-1.18l-2.375-2.38a3.686,3.686,0,0,0-1.188-.75A3.564,3.564,0,0,0,783,1051h-5.5a1.418,1.418,0,0,0-1.063.44,1.436,1.436,0,0,0-.438,1.06v7.5h-1a3.01,3.01,0,0,0-3,3v4.5a0.472,0.472,0,0,0,.149.35,0.478,0.478,0,0,0,.351.15H776v0.5a1.5,1.5,0,0,0,1.5,1.5h10a1.416,1.416,0,0,0,1.062-.44,1.432,1.432,0,0,0,.438-1.06V1068h3.5a0.48,0.48,0,0,0,.352-0.15,0.471,0.471,0,0,0,.148-0.35V1063A2.9,2.9,0,0,0,792.118,1060.88ZM787,1068h-9v-2h9v2Zm0-6h-9v-9h5v2.5a1.432,1.432,0,0,0,.438,1.06,1.456,1.456,0,0,0,1.063.44H787v5Zm2.851,1.85a0.487,0.487,0,0,1-.7,0,0.488,0.488,0,0,1,0-.7,0.487,0.487,0,0,1,.7,0A0.486,0.486,0,0,1,789.852,1063.85Z"
                        transform="translate(-772 -1051)"
                    />
                </svg>
            </button>
        </div>

        <p v-if="saveError" id="save-error" role="alert" class="print-ignore save-error mt-3 text-center text-sm">
            {{ saveError }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from "vue";
import { useRouter } from "vue-router";
import html2canvas from "html2canvas";
import { config } from "@/config";
import SecurityNotice from "@/components/SecurityNotice.vue";
import type { IWallet } from "@/interfaces";

const router = useRouter();

const wallet = ref<IWallet | null>(null);
const isAddressCopying = ref(false);
const isPassphraseCopying = ref(false);
const isSaving = ref(false);
const copyStatus = ref("");
const saveError = ref<string | null>(null);

const name = computed(() => config.getName());
const date = computed(() =>
    new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    }),
);
const network = computed(() => {
    const network = config.getNetwork();
    const name = config.getName();

    return name === "Custom"
        ? ` | Prefix ${config.getAddressPrefix()} - WIF ${config.getWIF()}`
        : ` | ${network.charAt(0).toUpperCase() + network.slice(1)}`;
});
/* Bare payloads: this is what wallet scanners expect, and it keeps the codes as sparse as possible. */
const codeForAddress = computed(() => wallet.value?.address ?? "");
const codeForPassphrase = computed(() => wallet.value?.passphrase ?? "");
const passphraseWords = computed(() => (wallet.value?.passphrase ?? "").split(" "));

const print = (): void => {
    window.print();
};

const animate = (flag: Ref<boolean>): void => {
    flag.value = true;
    setTimeout(() => (flag.value = false), 1000);
};

const announce = (message: string): void => {
    copyStatus.value = message;
    setTimeout(() => (copyStatus.value = ""), 1000);
};

const copyAddress = async (): Promise<void> => {
    if (!wallet.value) {
        return;
    }

    try {
        await navigator.clipboard.writeText(wallet.value.address);

        animate(isAddressCopying);
        announce("Address copied");
    } catch {
        announce("Copy failed");
    }
};

const copyPassphrase = async (): Promise<void> => {
    if (!wallet.value) {
        return;
    }

    try {
        await navigator.clipboard.writeText(wallet.value.passphrase);

        animate(isPassphraseCopying);
        announce("Passphrase copied");
    } catch {
        announce("Copy failed");
    }
};

const save = async (): Promise<void> => {
    const details = document.querySelector<HTMLElement>("#wallet-details");

    if (!details || !wallet.value) {
        return;
    }

    /* Hide the copy icons so they don't show up in the exported image. */
    const icons = [
        document.querySelector<HTMLElement>("#address-copy"),
        document.querySelector<HTMLElement>("#passphrase-copy"),
    ];

    saveError.value = null;
    icons.forEach((icon) => icon?.classList.add("hidden"));

    try {
        const canvas = await html2canvas(details, {
            backgroundColor: "#ffffff",
            scale: 2,
            logging: false,
        });

        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `protokol-paper-wallet-${wallet.value.address}.png`;
        link.click();

        animate(isSaving);
    } catch {
        saveError.value = "Could not generate the image. Use Print instead.";
    } finally {
        icons.forEach((icon) => icon?.classList.remove("hidden"));
    }
};

onMounted(() => {
    try {
        const serialized = window.history.state?.wallet;

        if (typeof serialized === "string") {
            wallet.value = JSON.parse(serialized) as IWallet;
            return;
        }

        router.push("/");
    } catch {
        router.push("/");
    }
});
</script>

<style>
@reference "tailwindcss";
/* Colours come through the design tokens rather than @apply: `@reference "tailwindcss"` resolves
   utilities against the stock theme, so an @apply'd colour would emit the default oklch() palette
   that html2canvas cannot parse — the very thing that broke the image export. */
.wallet-property-row {
    border-bottom-color: var(--color-line);
    @apply border-b border-dashed pb-6;
}

/* `anywhere` rather than `break-word`: it also zeroes the min-content width, so a 34-character
   address cannot push the card wider than a 390px viewport. */
.wallet-value {
    overflow-wrap: anywhere;
}

.passphrase-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(6rem, 1fr));
    grid-gap: 0.75rem 0.75rem;
}

.passphrase-index {
    left: 5px;
    top: 3px;
    font-size: 0.6rem;
    color: var(--color-ink-muted);
    @apply absolute font-semibold;
}

.save-error {
    color: var(--color-danger);
}
</style>
