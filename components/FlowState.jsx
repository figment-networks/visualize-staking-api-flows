// @ts-nocheck
import Link from "next/link";
import React, { useState } from "react";
import { Row, Col, Button, ConfigProvider, Steps, Step } from "antd";
import {
  SolutionOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import styles from "@styles/Home.module.css";
import Footer from "@components/Footer";

import { useAppState } from "@utilities/appState";

export default function FlowState({ operation }) {
  const { appState, setAppState } = useAppState();
  const [isLoading, setIsLoading] = useState(false);

  const { flowId, responseData, flowState } = appState;

  const handleGetState = async () => {
    const data = {
      flow_id: flowId,
    };

    setIsLoading(true);
    const response = await fetch(`/api/${operation}/get-flow-state`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    setAppState({ flowState: result.state, responseData: result });
    setIsLoading(false);
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
                current={5}
                status="finish"
                type="navigation"
                className={(styles.description, styles.progress)}
                items={[
                  {
                    title: "Create Account",
                    status: "finish",
                    icon: <CheckCircleOutlined />,
                    disabled: true,
                  },
                  {
                    title: "Create a Flow",
                    status: "finish",
                    icon: <CheckCircleOutlined />,
                    disabled: true,
                  },
                  {
                    title: "Submit Data",
                    status: "finish",
                    icon: <CheckCircleOutlined />,
                    disabled: true,
                  },
                  {
                    title: "Decode & Sign Payload",
                    status: "finish",
                    icon: <CheckCircleOutlined />,
                    disabled: true,
                  },
                  {
                    title: "Broadcast Transaction",
                    status: "finish",
                    icon: <CheckCircleOutlined />,
                    disabled: true,
                  },
                  {
                    title: "Get Flow State",
                    status: "process",
                    icon: isLoading ? (
                      <LoadingOutlined />
                    ) : flowState === "delegated" ? (
                      <SolutionOutlined />
                    ) : (
                      <LoadingOutlined />
                    ),
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

        <h1 className={styles.title}>Get Flow State</h1>

        <Row justify="space-around">
          <Col span={10}>
            <p className={styles.description}>
              {flowState === "delegate_tx_broadcasting" && (
                <>
                  Once the signed transaction has been broadcast by the Staking
                  API, it will take a moment to be confirmed on the network.
                  Check the final state of the flow with a GET request to the{" "}
                  Staking API endpoint, specifying the flow ID you want to
                  query.
                  <br />
                  <br /> For example <code>/api/v1/flows/{flowId}</code>
                </>
              )}
              {flowState === "delegated" && (
                <>
                  <p>
                    Congratulations! Flow{" "}
                    {flowId.toString().slice(0, -27) + "..."} state is{" "}
                    <code>{flowState}</code>, the transaction status is{" "}
                    <code>{responseData.data.delegate_transaction.status}</code>{" "}
                    and the staking flow is complete!
                    <br />
                    <br />
                    If you&apos;re interested, you can{" "}
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://explorer.testnet.near.org/transactions/${responseData?.data.delegate_transaction.hash}`}
                    >
                      view the transaction
                    </Link>{" "}
                    on the NEAR Block Explorer!
                    <br />
                    <br />
                    The final step in visualizing Staking API flow lifecycles is
                    understanding how to view all of the flows that you have
                    created.
                    <br />
                    <br />
                  </p>
                </>
              )}
            </p>
          </Col>
        </Row>

        <Row justify="space-around" className={styles.paddingBottom}>
          <Col span={10}>
            {flowState !== "delegated" ? (
              <Button
                className={styles.submitButton}
                type="primary"
                htmlType="button"
                onClick={() => handleGetState()}
              >
                Get Current Flow State
              </Button>
            ) : (
              <>
                <Button
                  className={styles.submitButton}
                  style={{ width: "210px" }}
                  type="primary"
                  onClick={() => setAppState({ ...appState, stepCompleted: 5 })}
                  href="/view-all-flows"
                >
                  Proceed to the next step &rarr;
                </Button>
                <br />
              </>
            )}
            <br />

            {isLoading ? (
              "Loading..."
            ) : (
              <>
                {responseData && flowState === "delegate_tx_broadcasting" && (
                  <>
                    <h3>&darr; Staking API Response</h3>
                    <pre
                      className={styles.stateResponseCentered}
                      style={{ width: "850px" }}
                    >
                      {JSON.stringify(responseData, null, 2)}
                    </pre>
                  </>
                )}
                {responseData && flowState === "delegated" && (
                  <>
                    <h3>&darr; Staking API Response</h3>
                    <pre
                      className={styles.stateResponseCentered}
                      style={{ width: "850px" }}
                    >
                      {JSON.stringify(responseData, null, 2)}
                    </pre>
                  </>
                )}
              </>
            )}
          </Col>
        </Row>

        <Footer />
      </ConfigProvider>
    </>
  );
}
