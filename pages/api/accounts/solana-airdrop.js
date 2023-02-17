// @ts-nocheck
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as bip39 from "bip39";

export default async function airdropToSolanaAccount(req, res) {
  const body = req.body;

  try {
    const seed = bip39.mnemonicToSeedSync(body.mnemonic, ""); // (mnemonic, password)
    const keypair = Keypair.fromSeed(seed.subarray(0, 32));

    const connection = new Connection("https://api.devnet.solana.com");

    const signature = await connection.requestAirdrop(
      keypair.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    console.log(`\nAirdrop request signature: ${signature}`);

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
    console.log(`Airdrop confirmed at slot ${confirmation.context.slot}`);

    const solBalance = await connection.getBalance(
      keypair.publicKey,
      "finalized"
    );

    return res.status(200).json({ confirmation, signature, solBalance });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}
