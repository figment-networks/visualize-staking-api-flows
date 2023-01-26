// @ts-nocheck
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "@styles/Home.module.css";
import { Col, Row, Button, Steps } from "antd";
import { SolutionOutlined, WarningOutlined } from "@ant-design/icons";
import AccountCard from "@components/AccountCard";
import Footer from "@components/Footer";
import { useAppState } from "@utilities/appState";

export default function CreateNEARAccountPage() {
  const router = useRouter();
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
      <Row justify="space-around">
        <Col span={24}>
          <div className={styles.header}>
            <Steps
              current={0}
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

      <h1 className={styles.title}>Create Account</h1>

      <Row justify="space-around">
        <Col span={12}>
          {!accountAddress && (
            <>
              <p className={styles.description}>
                Click the <b>Create Account</b> button to generate a random NEAR
                testnet account ID and keypair, which is only intended for use
                with this demo of Figment&apos;s Staking API.
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
                <Button
                  type="primary"
                  size="large"
                  // href="/operations/staking/create-flow"
                  style={{ width: "auto", textAlign: "center" }}
                  onClick={() => router.push("/operations/staking/create-flow")}
                >
                  Proceed to the next step &rarr;
                </Button>
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
                type="text"
                htmlType="button"
                className={styles.submitButton}
                onClick={handleResetAccount}
                icon={<WarningOutlined />}
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
    </>
  );
}
