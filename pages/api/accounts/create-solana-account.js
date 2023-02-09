// @ts-nocheck
const solana = require("@solana/web3.js");
import crypto from "crypto";
import { Connection, Keypair } from "@solana/web3.js";
import * as bip39 from "bip39";
import * as bs58 from "bs58";

import { setTimeout } from "timers/promises";

export default async function createSolanaAccount(req, res) {
  console.log("solana: ", solana);

  const mnemonic = bip39.generateMnemonic();

  const seed = bip39.mnemonicToSeedSync(mnemonic, ""); // (mnemonic, password)
  const keypair = Keypair.fromSeed(seed.subarray(0, 32));
  console.log(`Base58 PubKey: ${keypair.publicKey.toBase58()}`);

  //   const keypair = Keypair.fromMnemonic(mnemonic);
  const secretKey = keypair.secretKey.toString();
  const publicKey = keypair.publicKey.toString();

  console.log("m:", mnemonic);

  console.log("kp:", keypair);

  console.log("secret:", secretKey);

  //   const accountId = `${crypto.randomBytes(16).toString("hex")}`;

  // connection
  const connection = new Connection("https://api.devnet.solana.com");
  console.log(connection);
  const feePayer = Keypair.fromSecretKey(keypair.secretKey);

  console.log("Fee payer: ", feePayer);

  let txhash = await connection.requestAirdrop(
    feePayer.publicKey,
    1 * solana.LAMPORTS_PER_SOL
  );
  console.log(`txhash: ${txhash}`);

  //   let txhash2 = await connection.requestAirdrop(
  //     feePayer.publicKey,
  //     1 * solana.LAMPORTS_PER_SOL
  //   );
  //   console.log(`txhash2: ${txhash2}`);

  return res
    .status(200)
    .json({ txhash, keypair, secretKey, publicKey, mnemonic });
}
