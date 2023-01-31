// @ts-nocheck
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useAppState } from "@utilities/appState";
import Card from "@components/elements/Card";
import ToolTip from "@components/elements/ToolTip";
import styles from "@styles/Home.module.css";

const stepRoute = (step) =>
  ({
    0: "/operations/staking/create-near-account",
    1: "/operations/staking/create-flow",
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

export default function AccountCard() {
  const {
    appState: {
      flowId,
      flowCompleted,
      stepCompleted,
      accountAddress,
      accountPublicKey,
      accountPrivateKey,
    },
  } = useAppState();

  const NextStepLabel = ({ stepCompleted = 0, flowId }) => {
    if (stepCompleted === 0) return <p>Get into the flow &rarr;</p>;
    else if (stepCompleted < 5)
      return <p>Continue flow {flowId || ""} &rarr;</p>;
    else if (flowCompleted) return <p>Start a new flow &rarr;</p>;
    else return <></>;
  };

  return (
    <>
      {accountAddress && isIndex() ? (
        <Card href={!flowCompleted ? stepRoute(stepCompleted) : stepRoute(7)}>
          <ToolTip title="For your reference, this is a shortened version of the NEAR testnet address created by this app">
            <p>
              <code className={styles.yellow}>
                {`${accountAddress.slice(0, 6)}...${accountAddress.slice(
                  42,
                  -8
                )}.testnet`}
              </code>
            </p>
          </ToolTip>
          <NextStepLabel stepCompleted={stepCompleted} flowId={flowId} />
        </Card>
      ) : (
        <>
          <Card maxWidth={1000}>
            <h5 className="address">Account Address &rarr;</h5>
            <Link className="ext_link" href={explorerUrl(accountAddress)}>
              {accountAddress}
            </Link>

            {accountPublicKey && (
              <>
                <h6 className="pubkey">Account Public Key &rarr;</h6>
                <p>{accountPublicKey}</p>
              </>
            )}

            {accountPrivateKey && (
              <>
                <h6 className="pubkey">
                  Account Private Key (hover to reveal) &rarr;
                </h6>
                <p className="secret">{accountPrivateKey}</p>
              </>
            )}
          </Card>
        </>
      )}
    </>
  );
}
