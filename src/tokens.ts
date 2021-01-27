import { IToken } from "./interfaces";

export const tokens: Record<string, IToken> = {
    protokol: {
        name: "PROTOKOL",
        networks: {
            devnet: {
                addressPrefix: 55,
                wif: 170,
            },
        },
    },
    protokolEbsi: {
        name: "PROTOKOL EBSI",
        networks: {
            devnet: {
                addressPrefix: 33,
                wif: 233,
            },
        },
    },
    ark: {
        name: "ARK",
        networks: {
            mainnet: {
                addressPrefix: 23,
                wif: 170,
            },
            devnet: {
                addressPrefix: 30,
                wif: 170,
            },
        },
    },
};
