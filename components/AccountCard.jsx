// @ts-nocheck
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Card, Formatted, ToolTip } from "@components/ui-components";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

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

const solanaExplorerUrl = (address, cluster) =>
  `https://explorer.solana.com/address/${address}?cluster=${cluster}`;

const solscanUrl = (op, address, cluster) =>
  `https://solscan.io/${op}/${address}?cluster=${cluster}`;

// eslint-disable-next-line react-hooks/rules-of-hooks
const isIndex = () => useRouter().pathname === "/";

const trimmedAccount = (account) => {
  let trimmedAccount = account.slice(0, 6);
  trimmedAccount += `...${account.slice(42, -8)}`;
  trimmedAccount += `.testnet`;
  return trimmedAccount;
};

const trimmedSolanaAccount = (account) => {
  let trimmedAccount = account.slice(0, 6);
  trimmedAccount += `...${account.slice(30, -8)}`;
  // trimmedAccount += `.sol`;
  return <Formatted>{trimmedAccount}</Formatted>;
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
      sol_accountKeyPair,
      sol_accountPrivateKey,
      sol_accountPublicKey,
      sol_walletMnemonic,
      sol_airDropsRequested,
      sol_txhashAirdrop,
      solBalance,
    },
  } = useAppState();

  const stepLink = !flowCompleted ? stepRoute(stepCompleted) : stepRoute(7);

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
            {sol_accountPublicKey && !isIndex() && (
              <>
                <Card medium>
                  <h4>Solana</h4>
                  <p>
                    <Link
                      href={solanaExplorerUrl(sol_accountPublicKey, "devnet")}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {sol_accountPublicKey}
                    </Link>{" "}
                    has {solBalance / LAMPORTS_PER_SOL} ◎
                  </p>
                  {sol_airDropsRequested >= 1 && (
                    <ul>
                      <li>
                        2 SOL were{" "}
                        <ToolTip
                          style={{ textDecoration: "underline" }}
                          title={`View airdrop transaction on SolScan`}
                        >
                          <Link
                            rel="noopener noreferrer"
                            target="_blank"
                            href={solscanUrl("tx", sol_txhashAirdrop, "devnet")}
                          >
                            airdropped
                          </Link>
                        </ToolTip>{" "}
                        to this address on Devnet
                      </li>
                      {/* <li>
                      {" "}
                      Request additional Devnet airdrops from the{" "}
                      <Link
                        href="https://solfaucet.com/"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        SolFaucet
                      </Link>
                    </li> */}
                    </ul>
                  )}
                  {sol_accountPrivateKey && (
                    <>
                      <h6 className="pubkey">
                        Account Private Key Base58 (hover to reveal) &rarr;
                      </h6>
                      <p className="secret">{sol_accountPrivateKey}</p>
                    </>
                  )}
                  {sol_walletMnemonic && (
                    <>
                      <h6 className="pubkey">
                        Solana Wallet Mnemonic (hover to reveal) &rarr;
                      </h6>
                      <p className="secret">{sol_walletMnemonic}</p>
                    </>
                  )}
                </Card>
              </>
            )}

            {sol_accountPublicKey && isIndex() && (
              <>
                <ToolTip
                  title={`For your reference, this is the Solana account previously generated by this app.`}
                >
                  {trimmedSolanaAccount(sol_accountPublicKey)}
                </ToolTip>
              </>
            )}

            {accountPublicKey && (
              <>
                <Card medium>
                  <h4>NEAR</h4>
                  <Link
                    href={explorerUrl(accountAddress)}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {accountAddress}
                  </Link>

                  <h6 className="pubkey">Account Public Key &rarr;</h6>
                  <p>{accountPublicKey}</p>
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
          </Card>
        </>
      )}
    </>
  );
}
