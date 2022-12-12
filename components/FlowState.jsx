// @ts-nocheck
import React from "react";
import Link from "next/link";
import { useState } from "react";
import { useAppState } from "@utilities/appState";
import { Button, Modal, ConfigProvider } from "antd";

import styles from "@styles/Home.module.css";

export default function FlowState({ operation }) {
  const { appState, setAppState } = useAppState();

  // Destructure state variables
  const {
    flowId,
    flowResponse,
    responseData,
    flowState,
    flowActions,
    flowInputs,
    flowLabels,
  } = appState;

  const [isLoading, setIsLoading] = useState(false);

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
    console.log(result);
    setAppState({ flowState: result.state, responseData: result });
    setIsLoading(false);
  };

  return (
    <div className="container">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#034d77",
          },
        }}
      >
        <h1 className={styles.title}>Get Flow State</h1>

        <p className={styles.description}>
          After broadcasting the signed transaction, you can check on the state
          of the flow with a GET request.
          <br />
          <br />
          This can be done manually as in the example below, or by using{" "}
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://docs.figment.io/guides/staking-api/staking-api-endpoints#managing-webhooks"
          >
            Staking API Webhooks
          </Link>
          .
        </p>
        <p>
          Current Flow ID: <b>{flowId}</b>
        </p>

        <Button
          style={{ width: "auto" }}
          type="primary"
          htmlType="button"
          onClick={handleGetState}
        >
          Get current flow state
        </Button>

        <br />

        <Button style={{ width: "auto" }} type="primary" href="/view-all-flows">
          View All Flows
        </Button>

        <br />
        {isLoading ? "Loading..." : ""}

        {responseData && flowState === "delegated" ? (
          <>
            <p>
              {" "}
              Flow State is <b>{flowState}</b> &rarr;{" "}
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={`https://explorer.testnet.near.org/transactions/${responseData?.data.delegate_transaction.hash}`}
              >
                View Transaction Hash on Block Explorer
              </Link>
            </p>
            <pre className="response">
              {JSON.stringify(responseData, null, 2)}
            </pre>
          </>
        ) : (
          <>
            Flow State: <div className="payload">{flowState}</div>
          </>
        )}

        <div className="footer">
          <Link href="/">Return to Main Page</Link>
        </div>
      </ConfigProvider>
    </div>
  );
}
