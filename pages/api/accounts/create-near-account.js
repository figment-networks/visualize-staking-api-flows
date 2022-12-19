import crypto from "crypto";
import nearConfig from "@utilities/nearConfig";
import { KeyPair, connect } from "near-api-js";

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
