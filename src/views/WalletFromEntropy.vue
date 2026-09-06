<template>
    <div class="wallet-from-entropy mt-5">
        <div class="relative">
            <Spinner size="100" :line-size="5" line-fg-color="#444ce7" line-bg-color="#c4d0e2" />
            <div class="entropy-container">
                <div class="entropy-wrapper-outer bg-gray-200 rounded-full h-16 w-16">
                    <div class="entropy-wrapper-inner bg-white rounded-full h-12 w-12">
                        <span class="entropy-title">E{{ entropyProgress.title }}</span>
                        <span class="entropy-subtitle">{{ entropyProgress.subtitle }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Spinner from "@/components/Spinner.vue";
import { walletFromEntropy } from "@/crypto";

const router = useRouter();

const entropyProgress = ref({ title: "", subtitle: "" });

let entropyTimer: ReturnType<typeof setInterval> | null = null;

const collectValues = (count: number, callback: (values: number[]) => void): void => {
    const values: number[] = [];

    const fill = (): void => {
        const chunk = Math.min(64, count - values.length);
        const random = new Uint8Array(chunk);
        crypto.getRandomValues(random);
        values.push(...Array.from(random));

        if (values.length < count) {
            window.setTimeout(fill, 10);
        } else {
            callback(values);
        }
    };

    fill();
};

const generateWallet = (entropy: number[]): void => {
    try {
        router.push({
            name: "wallet",
            state: { wallet: JSON.stringify(walletFromEntropy(shuffle(entropy).slice(0, 16))) },
        });
    } catch {
        // invalid passphrase, give some error indicator
        if (entropyTimer) {
            clearInterval(entropyTimer);
        }
    }
};

const shuffle = (items: number[]): number[] => {
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }

    return items;
};

const generateEntropyProgress = (): void => {
    let value = numberBetween(1, 100).toString();

    while (value.length < 3) {
        value = "0" + value;
    }

    entropyProgress.value = {
        title: firstRandomHexCharacter().toUpperCase(),
        subtitle: value,
    };
};

const firstRandomHexCharacter = (): string => {
    const random = new Uint8Array(1);
    crypto.getRandomValues(random);
    const hex = random[0].toString(16);

    return hex.charAt(0);
};

const numberBetween = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

onMounted(() => {
    entropyTimer = setInterval(generateEntropyProgress, 100);

    collectValues(2048, (values) => {
        const randomBytes = new Uint8Array(256);
        crypto.getRandomValues(randomBytes);

        generateWallet(values.concat(Array.from(randomBytes)));
    });
});

onBeforeUnmount(() => {
    if (entropyTimer) {
        clearInterval(entropyTimer);
    }
});
</script>

<style>
@reference "tailwindcss";
.entropy-container {
    height: 100px;
    position: absolute;
    top: 0;
    width: 100px;
}

.entropy-wrapper-outer,
.entropy-wrapper-inner {
    @apply flex flex-col justify-center absolute left-0 right-0 mx-auto text-center;
}

.entropy-wrapper-outer {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
}

.entropy-wrapper-inner {
    padding-top: 4px;
}

.entropy-title {
    @apply font-bold text-base leading-none;
}

.entropy-subtitle {
    @apply text-gray-500 text-sm;
}
</style>
