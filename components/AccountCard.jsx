// @ts-nocheck
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useAppState } from "@utilities/appState";
import ToolTip from "@components/elements/ToolTip";
import styles from "@styles/Home.module.css";

import { Button, Card, Formatted } from "@pages/ui-components";

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

  return (
    <>
      {accountAddress && isIndex() ? (
        <Card>
          <Button
            href={!flowCompleted ? stepRoute(stepCompleted) : stepRoute(7)}
          >
            <ToolTip title="For your reference, this is a shortened version of the NEAR testnet address created by this app">
              <Formatted>
                {`${accountAddress.slice(0, 6)}...${accountAddress.slice(
                  42,
                  -8
                )}.testnet`}
              </Formatted>
            </ToolTip>
            <p>
              {stepCompleted === 0
                ? "Get into the flow &rarr;"
                : stepCompleted < 5
                ? `Continue flow ${flowId || ""} &rarr;`
                : flowCompleted
                ? "Start a new flow &rarr;"
                : ""}
            </p>
          </Button>
        </Card>
      ) : (
        <>
          <Card>
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
