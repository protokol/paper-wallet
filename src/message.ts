import { secp256k1 } from "@noble/curves/secp256k1.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, hexToBytes, utf8ToBytes } from "@noble/hashes/utils.js";

export interface ISignedMessage {
    message: string;
    publicKey: string;
    signature: string;
}

export const signMessage = (message: string, passphrase: string): ISignedMessage => {
    const privateKey = sha256(utf8ToBytes(passphrase));
    const signature = secp256k1.sign(sha256(utf8ToBytes(message)), privateKey, {
        format: "der",
        prehash: false,
    });

    return {
        publicKey: bytesToHex(secp256k1.getPublicKey(privateKey, true)),
        signature: bytesToHex(signature),
        message,
    };
};

export const verifyMessage = ({ message, publicKey, signature }: ISignedMessage): boolean => {
    try {
        return secp256k1.verify(hexToBytes(signature), sha256(utf8ToBytes(message)), hexToBytes(publicKey), {
            format: "der",
            prehash: false,
        });
    } catch {
        return false;
    }
};
