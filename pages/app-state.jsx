import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import AccountCard from "@components/AccountCard";
import { Button } from "antd";
import styles from "@styles/Home.module.css";

import { useAppState } from "@utilities/appState";

export default function IndexPage() {
  const {
    appState,
    setAppState,
    clearAppState,
    backupAppState,
    setBackupAppState,
  } = useAppState();

  // Destructure state variables
  const {
    flowId,
    flowState,
    flowActions,
    flowInputs,
    flowLabels,
    inputs,
    flowResponse,
    responseData,
    unsignedTransactionPayload,
    decodedTransactionPayload,
    signedTransactionPayload,
    validatorAddress,
    delegateAmount,
    stepCompleted,
    accountPublicKey,
    accountAddress,
    accountPrivateKey,
  } = appState;

  return (
    <>
      <Head>
        <title>Figment Staking API Flows - App State</title>
        <meta name="description" content="See inside the appState" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Visualize{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.figment.io/guides/staking-api"
            >
              Staking API
            </Link>{" "}
            Flows
          </h1>

          <p className={styles.intro}>Proof of Stake Made Easy!</p>

          <p className={styles.description}>
            Visualize the current appState &mdash;{" "}
            <Link href="/">Return to Main Page</Link>
          </p>
          <div className={styles.grid}>
            <p className={styles.card}>
              Account address: {accountAddress ? "✅" : "❌"}
              <br />
              Account keypair:{" "}
              {accountPublicKey && accountPrivateKey ? "✅" : "❌"}
              <br />
              <br />
              <Button
                type="primary"
                danger
                style={{ width: "auto" }}
                onClick={() => {
                  setAppState({
                    accountAddress: undefined,
                    accountPublicKey: undefined,
                    accountPrivateKey: undefined,
                  });
                }}
              >
                Reset NEAR testnet Account
              </Button>
            </p>

            <p className={styles.card}>
              <p className={styles.description}>
                ❌ indicates the state is not set (no user interaction), or has
                been cleared manually.
                <br />✅ indicates the value is set in appState
              </p>
              <br />
              <code>flowId</code>: {flowId ? "✅" : "❌"}
              <br />
              <code>flowState</code>: {flowState ? "✅" : "❌"}
              <br />
              <code>flowActions</code>:{" "}
              {flowActions.length > 0 ? flowActions : "❌"}
              <br />
              <code>flowInputs</code>:{" "}
              {flowInputs?.length > 0 ? flowInputs.join(", ") : "❌"}
              <br />
              <code>flowLabels</code>:{" "}
              {flowLabels?.length > 0 ? flowLabels.join(", ") : "❌"}
              <br />
              <code>inputs</code>: {inputs?.length > 0 ? "✅" : "❌"} (
              <code>inputs</code> is flowInputs & flowLabels combined, used to
              create dynamic forms)
              <br />
              <code>flowResponse</code>: {flowResponse ? "✅" : "❌"}
              <br />
              <code>responseData</code>: {responseData ? "✅" : "❌"}
              <br />
              <code>unsignedTransactionPayload</code>:{" "}
              {unsignedTransactionPayload ? "✅" : "❌"}
              <br />
              <code>decodedTransactionPayload</code>:{" "}
              {decodedTransactionPayload ? "✅" : "❌"}
              <br />
              <code>signedTransactionPayload</code>:{" "}
              {signedTransactionPayload ? "✅" : "❌"}
              <br />
              <code>validatorAddress</code>: {validatorAddress ? "✅" : "❌"}
              <br />
              <code>delegateAmount</code>: {delegateAmount ? "✅" : "❌"}
              <br />
              <code>stepCompleted</code>: {stepCompleted ? stepCompleted : "❌"}
              <br />
              <br />
              <Button
                danger
                style={{ width: "auto" }}
                type="primary"
                onClick={() => {
                  setBackupAppState(appState);
                  setAppState({
                    flowId: undefined,
                    flowState: undefined,
                    flowActions: undefined,
                    flowInputs: undefined,
                    flowLabels: undefined,
                    inputs: undefined,
                    flowResponse: undefined,
                    responseData: undefined,
                    unsignedTransactionPayload: undefined,
                    decodedTransactionPayload: undefined,
                    signedTransactionPayload: undefined,
                    validatorAddress: undefined,
                    delegateAmount: undefined,
                  });
                }}
              >
                Reset Current Flow
              </Button>
            </p>

            <p className={styles.card}>
              <Button
                danger
                style={{ width: "auto" }}
                type="primary"
                onClick={clearAppState}
              >
                Reset appState
              </Button>

              <details className="appStateDetails">
                <summary>
                  <span className="closed">
                    <code>appState</code> details
                  </span>
                </summary>

                <pre className="payload">
                  accountAddress:{" "}
                  {JSON.stringify(appState.accountAddress, null, 2)}
                </pre>
                <br />
                <pre className="payload">
                  accountPublicKey:{" "}
                  {JSON.stringify(appState.accountPublicKey, null, 2)}
                </pre>
                <br />
                <pre className="payload">
                  accountPrivateKey:{" "}
                  {JSON.stringify(appState.accountPrivateKey, null, 2)}
                </pre>
                <br />

                <pre className="payload">
                  flowId: {JSON.stringify(appState.flowId, null, 2)}
                </pre>
                <br />
                <pre className="payload">
                  flowState: {JSON.stringify(appState.flowState, null, 2)}
                </pre>
                <br />
                <pre className="payload">
                  flowActions: {JSON.stringify(appState.flowActions, null, 2)}
                </pre>
                <br />
                <pre className="payload">
                  flowInputs: {JSON.stringify(appState.flowInputs, null, 2)}
                </pre>
                <br />
                <pre className="payload">
                  flowLabels: {JSON.stringify(appState.flowLabels, null, 2)}
                </pre>
                <br />

                <details>
                  <summary>
                    Click here to expand <code>flowResponse</code>
                  </summary>
                  <pre className="payload">
                    flowResponse:{" "}
                    {JSON.stringify(appState.flowResponse, null, 2)}
                  </pre>
                  <br />
                </details>
                <br />

                <details>
                  <summary>
                    Click here to expand <code>responseData</code>
                  </summary>
                  <pre className="payload">
                    responseData:{" "}
                    {JSON.stringify(appState.responseData, null, 2)}
                  </pre>
                  <br />
                </details>
                <br />

                <pre className="payload">
                  unsignedTransactionPayload:{" "}
                  {JSON.stringify(appState.unsignedTransactionPayload, null, 2)}
                </pre>
                <br />
                <pre className="payload">
                  decodedTransactionPayload:{" "}
                  {JSON.stringify(appState.decodedTransactionPayload, null, 2)}
                </pre>
                <br />
                <pre className="payload">
                  signedTransactionPayload:{" "}
                  {JSON.stringify(appState.signedTransactionPayload, null, 2)}
                </pre>
                <br />
                <pre className="payload">
                  validatorAddress:{" "}
                  {JSON.stringify(appState.validatorAddress, null, 2)}
                </pre>
                <br />
                <pre className="payload">
                  delegateAmount:{" "}
                  {JSON.stringify(appState.delegateAmount, null, 2)}
                </pre>
                <br />
                <pre className="payload">
                  stepCompleted:{" "}
                  {JSON.stringify(appState.stepCompleted, null, 2)}
                </pre>
                <br />
              </details>
            </p>
          </div>
        </main>

        <footer className={styles.footer}>
          <a
            href="https://docs.figment.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Figment Docs
          </a>
          <a
            href="https://figment.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            Figment{" "}
            <span className={styles.logo}>
              <Image src="/f.svg" alt="Figment Logo" width={16} height={16} />
            </span>
          </a>
        </footer>
      </div>
    </>
  );
}
