// @ts-nocheck
import React from "react";
import Link from "next/link";
import { useState } from "react";
import { useAppState } from "@utilities/appState";
import { Button, Modal, ConfigProvider } from "antd";

import styles from "@styles/Home.module.css";

export default function FlowState({ operation }) {
  const { appState, setAppState, backupAppState } = useAppState();

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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

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
        <Modal
          title="Details"
          width="45%"
          footer={null}
          open={isModalOpen}
          onCancel={handleCancel}
        >
          <ul>
            <li>
              Once a flow state becomes <code>delegated</code>, that flow is
              complete and the tokens have successfully been staked.
            </li>
          </ul>
        </Modal>

        <div className="row">
          <h1 className={styles.title}>Get Flow State</h1>
        </div>
        <Button
          style={{ width: "auto", marginTop: "20px" }}
          type="primary"
          onClick={showModal}
        >
          Details
        </Button>

        <div className="row">
          <p className={styles.description}>
            After submitting the signed transaction, check the final state of
            the flow with a GET request to the <code>api/v1/flows</code>{" "}
            endpoint,
            <br />
            specifying the flowId you want to query. For example{" "}
            <code>/api/v1/flows/3937f7e8-987e-4e46-a149-30d3f3765b82</code>
          </p>
        </div>

        <div className="row">
          <div className="column">
            <p>
              Current Flow ID: <b>{flowId}</b>
            </p>
            <Button
              style={{ width: "auto" }}
              type="primary"
              htmlType="button"
              onClick={handleGetState}
            >
              Check current flow state
            </Button>
            {flowState === "delegated" ? (
              <>
                {" "}
                or{" "}
                <Button
                  style={{ width: "auto" }}
                  type="primary"
                  href="/view-all-flows"
                >
                  View All Flows
                </Button>
              </>
            ) : (
              ""
            )}
            <br />

            {isLoading ? (
              "Loading..."
            ) : (
              <>
                {responseData && flowState === "delegated" ? (
                  <>
                    <p>
                      {" "}
                      Flow State is now <b>{flowState}</b> &rarr;{" "}
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
              </>
            )}
          </div>
        </div>

        <div className="footer">
          <Link href="/">Return to Main Page</Link>
        </div>
      </ConfigProvider>
    </div>
  );
}
