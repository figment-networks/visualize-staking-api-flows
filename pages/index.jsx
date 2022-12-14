import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import AccountCard from "@components/AccountCard";
import { Button } from "antd";
import styles from "@styles/Home.module.css";

import { useAppState } from "@utilities/appState";

export default function IndexPage() {
  const { appState, clearAppState } = useAppState();

  // Destructure state variables
  const { accountPublicKey, accountAddress, accountPrivateKey } = appState;

  return (
    <>
      <Head>
        <title>Figment Staking API Flows</title>
        <meta
          name="description"
          content="Learn how to Navigate Figment's Staking API Flows"
        />
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
            Visualize and interact with Staking API flows. First, create an
            account.
          </p>
          <div className={styles.grid}>
            {accountAddress ? (
              <AccountCard
                accountAddress={accountAddress}
                accountPubKey={false}
                accountPrivateKey={false}
              />
            ) : (
              <Link href="/create-near-account" className={styles.card}>
                <h2>NEAR Account &rarr;</h2>
                <p>
                  Create a Testnet NEAR Account to Demo the Staking API flows
                </p>
              </Link>
            )}

            <Link
              href="/operations/staking/initialize-flow"
              className={styles.card}
            >
              <h2>Get into the Flow &rarr;</h2>
              <p>Explore Figment&apos;s Staking API Flows</p>
            </Link>

            <br />
            <br />

            <Link href="/app-state" className={styles.card}>
              <h2>App State &rarr;</h2>
              <p>Explore/Reset the App State</p>
            </Link>
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
