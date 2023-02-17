// @ts-nocheck
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Card, Formatted, ToolTip } from "@components/ui-components";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { useAppState } from "@utilities/appState";

const stepRoute = (step) =>
  ({
    0: "/create-solana-account",
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
  if (step <= 7 && !completed) stepLabel = `Continue flow ${flowId || ""} →`;
  else if (completed) stepLabel = "Start a new flow →";
  return stepLabel;
};

const solScanUrl = (op, address, cluster) =>
  `https://solscan.io/${op}/${address}?cluster=${cluster}`;

export const trimmedSolanaAccount = (account) => {
  let trimmedAccount = account.slice(0, 6);
  trimmedAccount += `...${account.slice(-6)}`;
  return <Formatted>{trimmedAccount}</Formatted>;
};

export default function AccountCard() {
  const router = useRouter();
  const path = router.pathname;
  let isIndex = false;

  if (path === "/") {
    isIndex = true;
  } else {
    isIndex = false;
  }

  const {
    appState: {
      flowId,
      flowCompleted,
      stepCompleted,
      sol_accountKeyPair,
      sol_accountPrivateKey,
      sol_accountPublicKey,
      sol_walletMnemonic,
      sol_airDropsRequested,
      solBalance,
    },
  } = useAppState();

  const stepLink = !flowCompleted ? stepRoute(stepCompleted) : stepRoute(7);

  const [viewKeyPair, setViewKeyPair] = useState(false);

  return (
    <>
      {sol_accountPublicKey && isIndex && (
        <>
          <Card small>
            <p className="center">
              Devnet Account:{" "}
              <ToolTip title="For your reference, this is a shortened version of the Solana Devnet public key created by this app.">
                <Link href="/create-solana-account">
                  {trimmedSolanaAccount(sol_accountPublicKey)}
                </Link>
              </ToolTip>
            </p>
            <Button href={stepLink}>
              {stepLabel(stepCompleted, flowCompleted, flowId)}
            </Button>
          </Card>
        </>
      )}

      {sol_accountPublicKey && !isIndex && (
        <>
          <Card medium>
            <h4>Solana</h4>
            <h6 className="pubkey">&darr; Account Public Key</h6>
            <p>
              <ToolTip title={`Click here to view account details on SolScan`}>
                <Link
                  href={solScanUrl("account", sol_accountPublicKey, "devnet")}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {sol_accountPublicKey}
                </Link>
              </ToolTip>{" "}
              has <b>{solBalance / LAMPORTS_PER_SOL}</b> ◎{" "}
            </p>
            <p>
              You have requested {sol_airDropsRequested || 0} airdrops to{" "}
              {trimmedSolanaAccount(sol_accountPublicKey)}.
            </p>

            {!viewKeyPair ? (
              <>
                <ToolTip
                  title={`Click here to view the raw keypair, base58 encoded private key and the seed phrase used to generate the keypair`}
                >
                  <Button
                    onClick={() => {
                      setViewKeyPair(true);
                    }}
                  >
                    Show Keypair Details
                  </Button>
                </ToolTip>
              </>
            ) : (
              <Card medium>
                <Button
                  onClick={() => {
                    setViewKeyPair(false);
                  }}
                >
                  Hide Keypair Details
                </Button>
                <br />

                {sol_accountPrivateKey && (
                  <>
                    <h6>
                      &darr; Account Private Key in Base58 (hover to reveal)
                    </h6>
                    <p className="secret">{sol_accountPrivateKey}</p>
                  </>
                )}

                {sol_walletMnemonic && (
                  <>
                    <h6>&darr; 12-Word Seed Phrase (hover to reveal)</h6>
                    <ul>
                      <li>This seed phrase is used to create the keypair.</li>
                    </ul>
                    <p className="secret">{sol_walletMnemonic}</p>
                  </>
                )}

                {sol_accountKeyPair && (
                  <>
                    <h6 className="pubkey">
                      &darr; Solana Account Keypair (as{" "}
                      <Formatted>Uint8Array</Formatted>)
                    </h6>
                    <Formatted block maxHeight="400px">
                      {JSON.stringify(sol_accountKeyPair, null, 2)}
                    </Formatted>
                  </>
                )}
              </Card>
            )}
          </Card>
        </>
      )}
    </>
  );
}
