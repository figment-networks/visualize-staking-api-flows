import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Row, Col } from "antd";
import AccountCard from "@components/AccountCard";
import Footer from "@components/Footer";
import styles from "@styles/Home.module.css";

import { useAppState } from "@utilities/appState";

export default function IndexPage() {
  const { appState } = useAppState();

  // Destructure state variables
  const { accountAddress, flowCompleted } = appState;

  const [isIndexPage, setIsIndexPage] = useState(true);

  useEffect(() => {
    setIsIndexPage(true);
  }, []);

  return (
    <>
      <Head>
        <title>Visualize Staking API Flows</title>
        <meta
          name="description"
          content="Visualize Figment's Staking API Flows"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <br />
      <br />
      <br />
      <Row justify="space-around">
        <Col span={16}>
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
        </Col>
      </Row>
      <br />
      <br />
      <Row justify="space-around">
        <Col span={6} />
        <Col span={12}>
          <p className={styles.intro}>
            {" "}
            Interact with Staking API flows in an intuitive, visual format.
          </p>
          <br />
          <br />
          <br />
          <br />
          <br />
          {accountAddress ? (
            <>
              <AccountCard
                accountAddress={accountAddress}
                accountPublicKey={false}
                accountPrivateKey={false}
              />
            </>
          ) : (
            <Link href="/create-near-account">
              <div className={styles.card} style={{ width: "700px" }}>
                <h2>NEAR Account &rarr;</h2>
                <p>
                  Create a Testnet NEAR Account to Demo the Staking API flows
                </p>
              </div>
            </Link>
          )}

          {flowCompleted && (
            <Link href="/view-all-flows" style={{ textDecoration: "none" }}>
              <div className={styles.card} style={{ width: "650px" }}>
                <h2>View All Flows &rarr;</h2>
                <p>Get information about all of the flows you have created.</p>
              </div>
            </Link>
          )}
        </Col>
        <Col span={6} />
      </Row>
      <Footer />
    </>
  );
}
