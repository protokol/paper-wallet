import "@/assets/css/tailwind.css";

import VueQrcode from "@chenfengyuan/vue-qrcode";
import { createApp } from "vue";
import { registerSW } from "virtual:pwa-register";
import App from "./App.vue";
import router from "./router";

if (import.meta.env.PROD) {
    registerSW({ immediate: true });
}

createApp(App).use(router).component("qrcode", VueQrcode).mount("#app");
