import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: Home,
        },
        // Wallet...
        {
            path: "/wallet/entropy",
            name: "wallet:entropy",
            component: () => import("./views/WalletFromEntropy.vue"),
        },
        {
            path: "/wallet/passphrase",
            name: "wallet:passphrase",
            component: () => import("./views/WalletFromPassphrase.vue"),
        },
        {
            path: "/wallet",
            name: "wallet",
            component: () => import("./views/Wallet.vue"),
        },
        // Message...
        {
            path: "/message/sign",
            name: "message:sign",
            component: () => import("./views/MessageSign.vue"),
        },
        {
            path: "/message/verify",
            name: "message:verify",
            component: () => import("./views/MessageVerify.vue"),
        },
        {
            path: "/message",
            name: "message",
            component: () => import("./views/Message.vue"),
        },
    ],
});

export default router;
