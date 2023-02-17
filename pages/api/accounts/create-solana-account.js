// @ts-nocheck
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as bip39 from "bip39";
import * as bs58 from "bs58";

const SOLANA_CLUSTER_URL = `https://api.devnet.solana.com`;

export default async function createSolanaAccount(req, res) {
  try {
    const mnemonic = bip39.generateMnemonic();
    const seed = bip39.mnemonicToSeedSync(mnemonic, ""); // (mnemonic, password)
    const keypair = Keypair.fromSeed(seed.subarray(0, 32));
    const secretKey = bs58.encode(keypair.secretKey);
    const publicKey = keypair.publicKey.toBase58();
    const connection = new Connection(SOLANA_CLUSTER_URL);

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    const signature = await connection.requestAirdrop(
      keypair.publicKey,
      2 * LAMPORTS_PER_SOL
    );

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

    console.log(
      `\nSolana account created from BIP39 12-word seed phrase!\nSee pages/api/accounts/create-solana-account.js for details.`
    );
    console.log(`\nAirdrop request signature: ${signature}`);
    console.log(`Airdrop confirmed at slot: ${confirmation.context.slot}`);
    console.log(
      `${keypair.publicKey} SOL balance on Devnet: ${
        solBalance / LAMPORTS_PER_SOL
      }\n`
    );

    return res.status(200).json({
      confirmation: confirmation.context.slot,
      signature,
      solBalance,
      keypair,
      secretKey,
      publicKey,
      mnemonic,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ createError: error.message });
  }
}
