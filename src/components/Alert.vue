<template>
    <div
        :class="type ? `alert-${type}` : 'opacity-0 hidden'"
        class="alert block w-full rounded-sm px-4 py-2 mt-4 text-white"
    >
        <div class="flex justify-between items-center text-left message font-semibold">
            <span>{{ message }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ message: string; type?: string }>(), {
    type: "info",
});
</script>

<style scoped>
.alert {
    transition:
        opacity,
        hidden 0.2s ease-in,
        background-color 0.1s ease-in;
}

.alert-error {
    background-color: #ec1b38;
}

.alert-success {
    background-color: #3bb15c;
}

.alert-info {
    background-color: #2199e5;
}

.alert-warn {
    background-color: #e5a721;
    color: #b03b12;
}
</style>
