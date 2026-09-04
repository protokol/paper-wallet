import { secp256k1 } from "@noble/curves/secp256k1";
import { sha256 } from "@noble/hashes/sha2";
import { bytesToHex, hexToBytes, utf8ToBytes } from "@noble/hashes/utils";

export interface ISignedMessage {
    message: string;
    publicKey: string;
    signature: string;
}

export const signMessage = (message: string, passphrase: string): ISignedMessage => {
    const privateKey = sha256(utf8ToBytes(passphrase));
    const signature = secp256k1.sign(sha256(utf8ToBytes(message)), privateKey);

    return {
        publicKey: bytesToHex(secp256k1.getPublicKey(privateKey, true)),
        signature: signature.toDERHex(),
        message,
    };
};

export const verifyMessage = ({ message, publicKey, signature }: ISignedMessage): boolean => {
    try {
        return secp256k1.verify(hexToBytes(signature), sha256(utf8ToBytes(message)), hexToBytes(publicKey));
    } catch {
        return false;
    }
};
