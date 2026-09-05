import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import autoprefixer from "autoprefixer";
import tailwind from "tailwindcss";
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
            manifest: {
                name: "ARK Paper Wallet",
                short_name: "ark-paper-wallet",
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
                background_color: "#fe463a",
                theme_color: "#fe463a",
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
            plugins: [tailwind(), autoprefixer()],
        },
    },
    test: {
        environment: "jsdom",
        globals: true,
        include: ["tests/unit/**/*.spec.ts"],
    },
});
