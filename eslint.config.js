import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";
import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";
import pluginVue from "eslint-plugin-vue";

export default defineConfigWithVueTs(
    {
        ignores: [
            "dist/**",
            "coverage/**",
            "releases/**",
            "playwright-report/**",
            "test-results/**",
            "node_modules/**",
            "public/**",
        ],
    },
    pluginVue.configs["flat/essential"],
    vueTsConfigs.recommended,
    skipFormatting,
    {
        rules: {
            "vue/multi-word-component-names": "off",
        },
    },
);
