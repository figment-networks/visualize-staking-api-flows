// @ts-nocheck
const solana = require("@solana/web3.js");
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as bip39 from "bip39";
import * as bs58 from "bs58";

import { setTimeout } from "timers/promises";

const SOLANA_CLUSTER_URL = `https://api.devnet.solana.com`;

export default async function createSolanaAccount(req, res) {
  const mnemonic = bip39.generateMnemonic();
  const seed = bip39.mnemonicToSeedSync(mnemonic, ""); // (mnemonic, password)
  const keypair = Keypair.fromSeed(seed.subarray(0, 32));
  const secretKey = bs58.encode(keypair.secretKey);
  const publicKey = keypair.publicKey.toBase58();

  const connection = new Connection(SOLANA_CLUSTER_URL);

  let signature = await connection.requestAirdrop(
    keypair.publicKey,
    2 * LAMPORTS_PER_SOL
  );

  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();

  const confirmation = await connection.confirmTransaction(
    {
      blockhash,
      lastValidBlockHeight,
      signature,
    },
    "finalized"
  );

  const solBalance = await connection.getBalance(
    keypair.publicKey,
    "finalized"
  );

  return res
    .status(200)
    .json({ signature, solBalance, keypair, secretKey, publicKey, mnemonic });
}
