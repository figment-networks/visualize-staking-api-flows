import { KeyPair, connect } from "near-api-js";
import nearConfig from "@utilities/nearConfig";
import crypto from "crypto";

export const nearTransactionUrl = (hash) =>
  `https://explorer.testnet.near.org/transactions/${hash}`;

export const nearExplorerUrl = (address) =>
  `https://explorer.testnet.near.org/accounts/${address}`;

export const getNearPublicKey = (secretKey) =>
  KeyPair.fromString(secretKey).getPublicKey().toString();

export const getNearPrettyPublicKey = (secretKey) =>
  KeyPair.fromString(secretKey).getPublicKey().toString().slice(8);

export default async function createNearAccount(req, res) {
  const keypair = KeyPair.fromRandom("ed25519");
  const accountId = `${crypto.randomBytes(24).toString("hex")}.testnet`;
  const publicKey = keypair.getPublicKey();
  const secretKey = keypair.toString();
  const client = await connect(nearConfig);
  await client.createAccount(accountId, publicKey);
  return res
    .status(200)
    .json({ secretKey, publicKey: publicKey.toString(), accountId });
}
