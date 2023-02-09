// @ts-nocheck
import React, { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import AccountCard from "@components/AccountCard";

import {
  DESCRIPTION,
  Head,
  Title,
  BreadCrumbs,
  Button,
  Card,
  Footer,
  LayoutVertical,
} from "@components/ui-components";

import { useAppState } from "@utilities/appState";

export default function CreateSolanaAccountPage() {
  const { appState, setAppState } = useAppState();
  const {
    sol_accountKeyPair,
    sol_accountPrivateKey,
    sol_accountPublicKey,
    sol_walletMnemonic,
  } = appState;
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const response = await fetch(`api/accounts/create-solana-account`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    let { txhash, keypair, secretKey, publicKey, mnemonic } =
      await response.json();

    console.log(
      "Remove this logging before pushing",
      txhash,
      keypair,
      secretKey,
      publicKey,
      mnemonic
    );

    setAppState({
      ...appState,
      sol_accountKeyPair: JSON.stringify(Uint8Array.from(keypair).toString()),
      sol_accountPrivateKey: Uint8Array.from(secretKey),
      sol_accountPublicKey: publicKey.toString(),
      sol_walletMnemonic: mnemonic,
      sol_txhashAirdrop: txhash,
    });

    setIsLoading(false);
  };

  const handleAirdrop = async (event) => {
    setIsLoading(true);

    const response = await fetch(`api/accounts/solana-airdrop`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(sol_accountKeyPair),
    });

    let { txhash } = await response.json();

    console.log("Remove this logging before pushing 2 --", txhash);

    // setAppState({
    //   ...appState,
    //   sol_accountKeyPair: keypair,
    //   sol_accountPrivateKey: Uint8Array.from(secretKey),
    //   sol_accountPublicKey: publicKey.toString(),
    //   sol_walletMnemonic: mnemonic,
    //   sol_txhashAirdrop: txhash,
    // });

    setIsLoading(false);
  };

  const handleResetAccount = async () => {
    setAppState({
      sol_accountPrivateKey: undefined,
      sol_accountPublicKey: undefined,
      sol_walletMnemonic: undefined,
    });
  };

  const title = "Create Solana Account";

  return (
    <>
      <Head title={title} description={DESCRIPTION} />
      <BreadCrumbs step={0} />
      <LayoutVertical>
        <Title>{title}</Title>

        {!sol_walletMnemonic && (
          <Card small>
            <p>
              Click the <b>Create Account</b> button to generate a random NEAR
              testnet account ID and keypair, which is only intended for use
              with this demo of Figment&apos;s Staking API.
            </p>
            <p>
              The private key of this keypair will be used to sign a transaction
              payload during the flow.
            </p>
            <form onSubmit={handleSubmit} method="post">
              <Button disabled={isLoading ? true : false}>
                Create Account
              </Button>
            </form>
          </Card>
        )}

        {sol_accountPublicKey && (
          <>
            <Card medium>
              <p>
                Your Solana account Public Key is <b>{sol_accountPublicKey}</b>
              </p>
              <p>
                <Button small secondary onClick={() => handleAirdrop()}>
                  Request 1 SOL Devnet Airdrop
                </Button>
              </p>
            </Card>
            <br />
          </>
        )}

        {isLoading && (
          <p className="center">
            <LoadingOutlined /> Loading...
          </p>
        )}

        {sol_accountPublicKey && (
          <>
            <Button href="/operations/staking/create-flow">
              Proceed to the next step &rarr;
            </Button>
            <br />
            <AccountCard
              sol_walletMnemonic={sol_walletMnemonic}
              sol_accountPublicKey={sol_accountPublicKey}
              sol_accountPrivateKey={sol_accountPrivateKey}
            />
            <br />
            <Button onClick={handleResetAccount} secondary small>
              Reset Account
            </Button>
          </>
        )}
      </LayoutVertical>
      <Footer />
    </>
  );
}
