import { secp256k1 } from "@noble/curves/secp256k1.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { ripemd160 } from "@noble/hashes/legacy.js";
import { bytesToHex, hexToBytes, utf8ToBytes } from "@noble/hashes/utils.js";
import { createBase58check } from "@scure/base";
import { entropyToMnemonic, mnemonicToEntropy, validateMnemonic as validateBIP39Mnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import { config } from "./config";
import type { IWallet } from "./interfaces";

// Historical compatibility note: the previously used bs58check implementation
// checksumed with a single SHA-256 round. Keep it to stay compatible with
// wallets that were generated (and fixtures that were recorded) by the old stack.
const base58check = createBase58check(sha256);

const getPublicKey = (privateKey: Uint8Array): string => bytesToHex(secp256k1.getPublicKey(privateKey, true));

const getAddress = (publicKeyHex: string): string => {
    const payload = new Uint8Array(21);
    payload[0] = config.getAddressPrefix();
    payload.set(ripemd160(hexToBytes(publicKeyHex)), 1);

    return base58check.encode(payload);
};

const getWIF = (privateKey: Uint8Array): string => {
    const payload = new Uint8Array(34);
    payload[0] = config.getWIF();
    payload.set(privateKey, 1);
    payload[33] = 0x01;

    return base58check.encode(payload);
};

export const validateMnemonic = (mnemonic: string): boolean =>
    validateBIP39Mnemonic(mnemonic.trim().split(/\s+/).join(" "), wordlist);

export const getEntropy = (mnemonic: string): string | undefined => {
    if (!validateMnemonic(mnemonic)) {
        return undefined;
    }

    return bytesToHex(mnemonicToEntropy(mnemonic, wordlist));
};

export const walletFromBIP39 = (passphrase: string): IWallet => {
    const privateKey = sha256(utf8ToBytes(passphrase));
    const publicKey = getPublicKey(privateKey);

    return {
        passphrase,
        address: getAddress(publicKey),
        publicKey,
        wif: getWIF(privateKey),
        entropy: getEntropy(passphrase),
    };
};

export const walletFromEntropy = (entropy: Uint8Array | number[]): IWallet => {
    const bytes = Uint8Array.from(entropy);
    const wallet = walletFromBIP39(entropyToMnemonic(bytes, wordlist));
    wallet.entropy = bytesToHex(bytes);

    return wallet;
};
