// @ts-nocheck
const solana = require("@solana/web3.js");
import crypto from "crypto";
import { Connection, Keypair } from "@solana/web3.js";
import * as bip39 from "bip39";
import * as bs58 from "bs58";

import { setTimeout } from "timers/promises";

export default async function airdropToSolanaAccount(req, res) {
  console.log("Airdrop Request body: ", req.body);

  // connection
  const connection = new Connection("https://api.devnet.solana.com");
  //   console.log("Solana connection to Devnet: ", connection);
  const feePayer = Keypair.fromSecretKey(req.body.secretKey);

  console.log("Airdrop Fee payer: ", feePayer);

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

  return res.status(200).json({ txhash });
}
