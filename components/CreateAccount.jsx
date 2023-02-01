// @ts-nocheck
import React, { useState } from "react";
import styles from "@styles/Home.module.css";
import AccountCard from "@components/AccountCard";
import { useAppState } from "@utilities/appState";
import { Title, BreadCrumbs, Button, Card, Footer } from "@pages/ui-components";

export default function CreateNEARAccountPage() {
  const { appState, setAppState } = useAppState();
  const { accountPrivateKey, accountPublicKey, accountAddress } = appState;
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    const response = await fetch("api/accounts/create-near-account", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const { secretKey, publicKey, accountId } = await response.json();

    setAppState({
      ...appState,
      accountPrivateKey: secretKey,
      accountPublicKey: publicKey,
      accountAddress: accountId,
    });

    setIsLoading(false);
  };

  const handleResetAccount = async () => {
    setAppState({
      accountPrivateKey: undefined,
      accountPublicKey: undefined,
      accountAddress: undefined,
    });
  };

  return (
    <>
      <BreadCrumbs step={0} />
      <Title>Create NEAR Account</Title>

      {!accountAddress && (
        <Card>
          <p>
            Click the <b>Create Account</b> button to generate a random NEAR
            testnet account ID and keypair, which is only intended for use with
            this demo of Figment&apos;s Staking API.
          </p>
          <p>
            The private key of this keypair will be used to sign a transaction
            payload during the flow.
          </p>
          <form onSubmit={handleSubmit} method="post">
            <Button disabled={isLoading ? true : false}>Create Account</Button>
          </form>
        </Card>
      )}

      {accountAddress && (
        <>
          <Card>
            <p>
              Your randomly generated account ID is <b>{accountAddress}</b>
            </p>
          </Card>
        </>
      )}

      {isLoading && <p className={styles.centerLabel}>Loading...</p>}
      {accountPublicKey && (
        <>
          <h2 className={styles.centerLabel}>
            <Button href="/operations/staking/create-flow">
              Proceed to the next step &rarr;
            </Button>
          </h2>
          <AccountCard
            accountAddress={accountAddress}
            accountPublicKey={accountPublicKey}
            accountPrivateKey={accountPrivateKey}
          />
          <Button onClick={handleResetAccount} destructive>
            Reset Account
          </Button>
        </>
      )}
      <Footer />
    </>
  );
}
