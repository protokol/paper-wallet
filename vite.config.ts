import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/postcss";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vitest/config";

let base = "/";

if (process.env.RELEASE_TYPE === "dist") {
    base = "./";
} else if (process.env.RELEASE_TYPE === "gh-pages") {
    base = "/paper-wallet/";
}

export default defineConfig({
    base,
    plugins: [
        vue(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["favicon.ico", "favicon.png", "favicon.svg", "robots.txt"],
            // NOTE: background_color and theme_color below are hand-copied duplicates of --color-page and
            // --color-brand-600 in src/assets/css/tailwind.css. A manifest cannot read CSS custom properties,
            // so a palette change must also update these two values and the theme-color meta in index.html.
            manifest: {
                name: "Protokol Paper Wallet",
                short_name: "paper-wallet",
                icons: [
                    {
                        src: "./img/icons/android-chrome-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "./img/icons/android-chrome-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
                start_url: "./index.html",
                display: "standalone",
                background_color: "#e2e6ec",
                theme_color: "#1a66b8",
            },
        }),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    css: {
        postcss: {
            plugins: [tailwindcss()],
        },
    },
    test: {
        environment: "jsdom",
        globals: true,
        include: ["tests/unit/**/*.spec.ts"],
    },
});
