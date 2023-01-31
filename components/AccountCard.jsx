// @ts-nocheck
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useAppState } from "@utilities/appState";
import Card from "@components/elements/Card";
import ToolTip from "@components/elements/ToolTip";

const stepRoute = (step) =>
  ({
    0: "/operations/staking/create-flow",
    2: "/operations/staking/submit-data",
    3: "/operations/staking/sign-payload",
    4: "/operations/staking/broadcast-transaction",
    5: "/operations/staking/flow-state",
    6: "/operations/staking/create-flow",
    7: "/operations/staking/create-flow",
  }[step]);

const explorerUrl = (address) =>
  `https://explorer.testnet.near.org/accounts/${address}`;

const isIndex = () => useRouter().pathname === "/";

const NextStepLabel = ({ stepCompleted = 0, flowId }) => {
  if (stepCompleted === 0) return <p>Get into the flow &rarr;</p>;
  else if (stepCompleted < 5) return <p>Continue flow {flowId || ""} &rarr;</p>;
  else if (stepCompleted === 5) return <p>Start a new flow &rarr;</p>;
  else return <></>;
};

export default function AccountCard() {
  const {
    appState: {
      flowId,
      stepCompleted,
      accountAddress,
      accountPublicKey,
      accountPrivateKey,
    },
  } = useAppState();

  return (
    <>
      {accountAddress && isIndex() ? (
        <Card href={stepRoute(stepCompleted)}>
          <ToolTip title="For your reference, this is a shortened version of the NEAR testnet address created by this app">
            <code className="yellow">
              {`${accountAddress.slice(0, 6)}...${accountAddress.slice(
                42,
                -8
              )}.testnet`}
            </code>
          </ToolTip>
          <NextStepLabel stepCompleted={stepCompleted} flowId={flowId} />
        </Card>
      ) : (
        <>
          <Card maxWidth={1000}>
            <h2 className="address">Account Address &rarr;</h2>
            <Link className="ext_link" href={explorerUrl(accountAddress)}>
              {accountAddress}
            </Link>

            {accountPublicKey && (
              <>
                <h3 className="pubkey">Account Public Key &rarr;</h3>
                <p>{accountPublicKey}</p>
              </>
            )}

            {accountPrivateKey && (
              <>
                <h3 className="pubkey">
                  Account Private Key (hover to reveal) &rarr;
                </h3>
                <p className="secret">{accountPrivateKey}</p>
              </>
            )}
          </Card>
        </>
      )}
    </>
  );
}
