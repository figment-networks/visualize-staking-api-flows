// @ts-nocheck
import crypto from "crypto";
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as bip39 from "bip39";
import * as bs58 from "bs58";

export default async function airdropToSolanaAccount(req, res) {
  const body = req.body;
  let signature = "";

  const seed = bip39.mnemonicToSeedSync(body.mnemonic, ""); // (mnemonic, password)
  const keypair = Keypair.fromSeed(seed.subarray(0, 32));

  const connection = new Connection("https://api.devnet.solana.com");

  try {
    signature = await connection.requestAirdrop(
      keypair.publicKey,
      2 * LAMPORTS_PER_SOL
    );
  } catch (error) {
    console.log(error);
  }

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

  return res.status(200).json({ confirmation, signature, solBalance });
}
