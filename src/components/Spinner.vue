<template>
    <div class="e-spinner" :style="{ width: `${sizePx}px`, height: `${sizePx}px` }">
        <div
            class="e-spinner-ring"
            :style="{ borderWidth: `${lineSizePx}px`, borderColor: lineBgColor, borderTopColor: lineFgColor }"
        ></div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
    defineProps<{
        size?: number | string;
        lineSize?: number | string;
        lineFgColor?: string;
        lineBgColor?: string;
    }>(),
    {
        size: 60,
        lineSize: 5,
        lineFgColor: "#429ef5",
        lineBgColor: "#e2e6ec",
    },
);

const sizePx = computed(() => Number(props.size));
const lineSizePx = computed(() => Number(props.lineSize));
</script>

<style scoped>
.e-spinner {
    display: flex;
    align-items: center;
    justify-content: center;
}

.e-spinner-ring {
    width: 100%;
    height: 100%;
    border-style: solid;
    border-radius: 50%;
    animation: e-spinner-rotate 1s linear infinite;
}

@keyframes e-spinner-rotate {
    to {
        transform: rotate(360deg);
    }
}
</style>
