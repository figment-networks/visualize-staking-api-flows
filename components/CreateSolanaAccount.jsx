// @ts-nocheck
import React, { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import AccountCard from "@components/AccountCard";
import * as bs58 from "bs58";

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
    sol_airDropsRequested,
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

    let { signature, solBalance, keypair, secretKey, publicKey, mnemonic } =
      await response.json();

    setAppState({
      ...appState,
      sol_accountKeyPair: keypair,
      sol_accountPrivateKey: secretKey,
      sol_accountPublicKey: publicKey.toString(),
      sol_walletMnemonic: mnemonic,
      sol_txhashAirdrop: signature,
      solBalance: solBalance,
    });

    setIsLoading(false);
  };

  const handleAirdrop = async (event) => {
    const data = {
      keyPair: sol_accountKeyPair,
      mnemonic: sol_walletMnemonic,
      publicKey: sol_accountPublicKey,
      privateKey: sol_accountPrivateKey,
    };

    setIsLoading(true);

    const response = await fetch(`api/accounts/solana-airdrop`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    });

    let { confirmation, signature, solBalance } = await response.json();

    setAppState({
      sol_txhashAirdrop: signature,
      sol_airDropsRequested: sol_airDropsRequested + 1,
      solBalance: solBalance,
    });

    setIsLoading(false);
  };

  const handleResetAccount = async () => {
    setAppState({
      sol_airDropsRequested: undefined,
      sol_accountKeyPair: undefined,
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
              Click the <b>Create Account</b> button to generate a Solana devnet
              account and wallet mnemonic, which is only intended for use with
              this demo of Figment&apos;s Staking API.
            </p>
            <p>
              The private key of the account keypair will be used to sign a
              transaction payload during the flow.
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
              <p style={{ textAlign: "center" }}>
                Your Solana account Public Key is <b>{sol_accountPublicKey}</b>
              </p>
              <p style={{ textAlign: "center" }}>
                You have requested {sol_airDropsRequested} airdrops with this
                account.
              </p>

              <p>
                <Button
                  disabled={isLoading}
                  small
                  secondary
                  onClick={() => handleAirdrop()}
                >
                  Request 2 SOL airdrop on Devnet
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
            <Button href="/operations/sol-staking/create-flow">
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
