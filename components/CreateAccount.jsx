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

  const title = "Create NEAR Account";

  return (
    <>
      <Head title={title} description={DESCRIPTION} />
      <BreadCrumbs step={0} />
      <LayoutVertical>
        <Title>{title}</Title>

        {!accountAddress && (
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

        {accountAddress && (
          <>
            <Card medium>
              <p>
                Your randomly generated account ID is <b>{accountAddress}</b>
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

        {accountPublicKey && (
          <>
            <Button href="/operations/staking/create-flow">
              Proceed to the next step &rarr;
            </Button>
            <br />
            <AccountCard
              accountAddress={accountAddress}
              accountPublicKey={accountPublicKey}
              accountPrivateKey={accountPrivateKey}
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
