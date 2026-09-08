<template>
    <div
        :class="type ? `alert-${type}` : 'opacity-0 hidden'"
        class="alert block w-full rounded-sm px-4 py-2 mt-4 text-white"
        role="alert"
    >
        <div class="flex justify-between items-center text-left message font-semibold">
            <span>{{ message }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
type AlertType = "error" | "success" | "info" | "warn";

withDefaults(defineProps<{ message: string; type?: AlertType }>(), {
    type: "info",
});
</script>

<style scoped>
.alert {
    transition:
        opacity 0.2s ease-in,
        background-color 0.1s ease-in;
}

.alert-error {
    background-color: var(--color-danger);
}

.alert-success {
    background-color: var(--color-success);
}

.alert-info {
    background-color: var(--color-info);
}

.alert-warn {
    background-color: var(--color-warning);
    color: var(--color-warning-ink);
}
</style>
