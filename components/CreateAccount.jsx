// @ts-nocheck
import React, { useState } from "react";
import { LoadingOutlined, WarningOutlined } from "@ant-design/icons";
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
  Formatted,
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
    sol_TxConfirmations,
    createError,
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

    if (response.status >= 400) {
      console.log("###### SOLANA ACCOUNT CREATION ERROR");
      console.log(response.body);
    }

    let {
      confirmation,
      signature,
      solBalance,
      keypair,
      secretKey,
      publicKey,
      mnemonic,
      createError,
    } = await response.json();

    setAppState({
      ...appState,
      sol_accountKeyPair: keypair,
      sol_accountPrivateKey: secretKey,
      sol_accountPublicKey: publicKey,
      sol_walletMnemonic: mnemonic,
      sol_txhashAirdrop: signature,
      sol_TxConfirmations: [confirmation],
      solBalance: solBalance,
      createError: createError,
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
      sol_TxConfirmations: [confirmation],
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
            <p>
              Immediately after the account is created, we request a 2 SOL
              airdrop on devnet. You can also request additional airdrops if you
              need more SOL for testing.
            </p>
            <form onSubmit={handleSubmit} method="post">
              <Button disabled={isLoading ? true : false}>
                {isLoading && <LoadingOutlined />} Create Account
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
                <b>Note</b>: This public key will be used as a default value for
                the Funding Account during the flow.
                <br />
                The private key of this account keypair will be used to sign
                transaction payloads during the flow.
              </p>

              <p style={{ textAlign: "center" }}>
                Return to this page to request additional airdrops by clicking{" "}
                <b>Create Account</b>, displayed in the list of steps at the top
                of the screen.
              </p>
              <p style={{ textAlign: "center" }}>
                <Button
                  disabled={isLoading}
                  small
                  secondary
                  onClick={() => handleAirdrop()}
                >
                  {isLoading && <LoadingOutlined />} Request 2 SOL airdrop on
                  Devnet
                </Button>
              </p>
            </Card>
            <br />
          </>
        )}

        {createError && (
          <>
            <p className="callout">
              <WarningOutlined />{" "}
              <b>
                An error occurred while requesting an airdrop of SOL to the
                account.
              </b>
              <br />
              Please check the server console for more information.
              <br />
              This is likely due to rate limiting by public RPC endpoints,{" "}
              <br />
              which can occur if creating and resetting accounts too quickly.
              <br />
              <Formatted block>{createError}</Formatted>
            </p>
          </>
        )}

        {sol_accountPublicKey && (
          <>
            <Button disabled={isLoading} href="/operations/staking/create-flow">
              Proceed to the next step &rarr;
            </Button>
            <br />
            <AccountCard
              sol_walletMnemonic={sol_walletMnemonic}
              sol_accountPublicKey={sol_accountPublicKey}
              sol_accountPrivateKey={sol_accountPrivateKey}
            />
            <br />
            <Button
              disabled={isLoading}
              onClick={handleResetAccount}
              secondary
              small
            >
              Reset Account
            </Button>
          </>
        )}
      </LayoutVertical>
      <Footer />
    </>
  );
}
