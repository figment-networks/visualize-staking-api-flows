// @ts-nocheck
import Link from "next/link";
import React, { useState } from "react";
import styles from "@styles/Home.module.css";
import { Col, Row, Button, ConfigProvider, Steps } from "antd";
import { SolutionOutlined } from "@ant-design/icons";
import AccountCard from "@components/AccountCard";
import Footer from "@components/Footer";

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

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#0D858B",
            colorError: "#C90000",
          },
        }}
      >
        <Row justify="space-around">
          <Col span={24}>
            <div className={styles.header}>
              <Steps
                current={0}
                className={(styles.description, styles.progress)}
                type="navigation"
                items={[
                  {
                    title: "Create Account",
                    status: "finish",
                    icon: <SolutionOutlined />,
                  },
                  {
                    title: "Create a Flow",
                    status: "process",
                    icon: <SolutionOutlined />,
                  },
                  {
                    title: "Submit Data",
                    // status: "wait",
                    icon: <SolutionOutlined />,
                  },
                  {
                    title: "Decode & Sign Payload",
                    status: "wait",
                    icon: <SolutionOutlined />,
                  },
                  {
                    title: "Broadcast Transaction",
                    status: "wait",
                    icon: <SolutionOutlined />,
                  },
                  {
                    title: "View All Flows",
                    status: "wait",
                    icon: <SolutionOutlined />,
                  },
                ]}
              />
            </div>
          </Col>
        </Row>

        <h1 className={styles.title}>Create a NEAR .testnet account</h1>

        <Row justify="space-around">
          <Col span={12}>
            {!accountAddress && (
              <>
                <p className={styles.description}>
                  Click the <b>Create Account</b> button to generate a random
                  NEAR testnet account ID and keypair,
                  <br /> which is only intended for use with this demo of
                  Figment&apos;s Staking API.
                  <br />
                  <br />
                  The private key of this keypair will be used to sign a
                  transaction payload during the flow.
                </p>
                <br />
                <form onSubmit={handleSubmit} method="post">
                  <Button
                    size="large"
                    type="primary"
                    htmlType="submit"
                    className={styles.submitButton}
                    disabled={isLoading ? true : false}
                  >
                    Create Account
                  </Button>
                </form>
              </>
            )}
            {accountAddress && (
              <>
                <p className={styles.description}>
                  Your randomly generated account ID is <b>{accountAddress}</b>
                  <br />
                </p>
              </>
            )}
          </Col>
        </Row>

        <Row justify="center" className={styles.paddingBottom}>
          <Col span={4} />
          <Col span={16}>
            <br />
            {isLoading && <p className={styles.centerLabel}>Loading...</p>}
            {accountPublicKey && (
              <>
                <h2 className={styles.centerLabel}>
                  Time to get into the flow &rarr;{" "}
                  <Link
                    type="primary"
                    size="large"
                    href="/operations/staking/create-flow"
                    style={{ width: "350px", textAlign: "center" }}
                  >
                    Click Here to Explore Figment&apos;s Staking API
                  </Link>
                </h2>

                <br />
                <AccountCard
                  accountAddress={accountAddress}
                  accountPublicKey={accountPublicKey}
                  accountPrivateKey={accountPrivateKey}
                />
                <br />
                <Button
                  size="large"
                  style={{ width: "auto", marginTop: "20px" }}
                  type="primary"
                  htmlType="button"
                  className={styles.submitButton}
                  onClick={handleResetAccount}
                >
                  Reset Account
                </Button>
                <br />
                <br />
              </>
            )}
          </Col>
          <Col span={4} />
        </Row>

        <Footer />
      </ConfigProvider>
    </>
  );
}
