import { IToken } from "./interfaces";

export const tokens: Record<string, IToken> = {
    protokol: {
        name: "Protokol",
        networks: {
            devnet: {
                addressPrefix: 55,
                wif: 170,
            },
        },
    },
    nascar: {
        name: "Nascar",
        networks: {
            devnet: {
                addressPrefix: 53,
                wif: 253,
            },
        },
    },
    ebsi: {
        name: "EBSI",
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
