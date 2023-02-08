// @ts-nocheck
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Card, Formatted, ToolTip } from "@components/ui-components";

import { useAppState } from "@utilities/appState";

const stepRoute = (step) =>
  ({
    0: "/create-near-account",
    1: "/operations/staking/create-flow",
    2: "/operations/staking/submit-data",
    3: "/operations/staking/sign-payload",
    4: "/operations/staking/broadcast-transaction",
    5: "/operations/staking/flow-state",
    6: "/view-all-flows",
    7: "/operations/staking/create-flow",
  }[step]);

const stepLabel = (step, completed, flowId) => {
  let stepLabel = "Get into the flow →";
  if (step <= 6 && !completed) stepLabel = `Continue flow ${flowId || ""} →`;
  else if (completed) stepLabel = "Start a new flow →";
  return stepLabel;
};

const explorerUrl = (address) =>
  `https://explorer.testnet.near.org/accounts/${address}`;

// eslint-disable-next-line react-hooks/rules-of-hooks
const isIndex = () => useRouter().pathname === "/";

const trimmedAccount = (account) => {
  let trimmedAccount = account.slice(0, 6);
  trimmedAccount += `...${account.slice(42, -8)}`;
  trimmedAccount += `.testnet`;
  return trimmedAccount;
};

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

  const stepLink = !flowCompleted ? stepRoute(stepCompleted) : stepRoute(7);

  console.log(stepLink);

  return (
    <>
      {accountAddress && isIndex() ? (
        <Card small>
          <p>
            Testnet Account:{" "}
            <Formatted>
              <ToolTip title="For your reference, this is a shortened version of the NEAR testnet address created by this app.">
                <Link href="/create-near-account">
                  {trimmedAccount(accountAddress)}
                </Link>
              </ToolTip>
            </Formatted>
          </p>
          <Button href={stepLink}>
            {stepLabel(stepCompleted, flowCompleted, flowId)}
          </Button>
        </Card>
      ) : (
        <>
          <Card medium>
            <h6>Account Address &rarr;</h6>
            <Link
              href={explorerUrl(accountAddress)}
              rel="noopener noreferrer"
              target="_blank"
            >
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
