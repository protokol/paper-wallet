<template>
    <div v-if="variant === 'screen'" class="security-notice-screen">
        <p class="security-notice-copy">
            Generate on a device that is offline if this wallet will hold real funds. Anyone who sees this passphrase
            controls it.
        </p>
    </div>
    <p v-else class="security-notice-print">
        Keep this sheet private and offline. This passphrase is the only way to recover the funds.
    </p>
</template>

<script setup lang="ts">
defineProps<{ variant: "screen" | "print" }>();
</script>

<style scoped>
@reference "tailwindcss";

/* Colours come from the design tokens rather than @apply: `@reference "tailwindcss"` resolves
   utilities against the stock theme, which emits oklch() values html2canvas cannot parse. */
.security-notice-screen {
    background-color: var(--color-warning);
    color: var(--color-warning-ink);
    @apply rounded-sm px-4 py-3 text-sm leading-snug;
}

/* The banner stretches to the card's width, but the sentence stops wrapping at a readable measure. */
.security-notice-copy {
    max-width: 42rem;
}

.security-notice-print {
    color: var(--color-ink-muted);
    @apply text-xs leading-snug;
}
</style>
