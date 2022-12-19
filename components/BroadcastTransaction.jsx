import Link from "next/link";
import React, { useState } from "react";
import styles from "/styles/Home.module.css";
import { Button, Modal, ConfigProvider } from "antd";

import { useAppState } from "@utilities/appState";

export default function BroadcastTransaction({ operation }) {
  const { appState, setAppState } = useAppState();
  const { flowId, flowState, signedTransactionPayload } = appState;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const data = {
      flow_id: flowId,
      action: form.flow_action.value,
      signed_payload: form.signed_payload.value,
    };

    const response = await fetch(`/api/${operation}/broadcast-transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (result.code) {
      alert(`${result.code}: ${result.message}`);
    }

    if (result.data) {
      console.log("Transaction state: ", result.state);
      setAppState({ flowState: result.state });
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="container">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#034d77",
              colorError: "#C90000",
            },
          }}
        >
          <div className="row">
            <h1 className={styles.title}>
              Submit Signed Transaction for Broadcast
            </h1>
          </div>

          <Button
            style={{
              width: "auto",
              marginTop: "20px",
              paddingBottom: "10px",
              fontWeight: "bold",
            }}
            type="primary"
            onClick={() => showModal()}
          >
            Click Here For More Information
          </Button>

          <div className="row">
            <p className={styles.description}>
              After signing the transaction, provide the signed{" "}
              <code>transaction_payload</code>.<br />
              The Staking API will then validate and broadcast the transaction
              to the network.
            </p>
          </div>

          <div className="row">
            <div className="column">
              <form onSubmit={handleSubmit} method="post">
                <label htmlFor="action" style={{ textAlign: "left" }}>
                  Action:
                </label>
                <select
                  id="action"
                  name="flowAction"
                  required
                  defaultValue="sign_delegate_tx"
                >
                  <option value="sign_delegate_tx">sign_delegate_tx</option>
                </select>

                <br />

                <label htmlFor="signed_payload">
                  Signed Transaction Payload
                </label>

                <textarea
                  id="signed_payload"
                  name="signed_payload"
                  rows={8}
                  cols={80}
                  required
                  defaultValue={signedTransactionPayload}
                />
                <br />
                <br />

                <Button
                  style={{ width: "auto" }}
                  type="primary"
                  htmlType="submit"
                >
                  Submit Signed Transaction Payload for Broadcast
                </Button>
              </form>
            </div>

            <div className="column">
              {flowState && (
                <>
                  <br />
                  <br />
                  <br />
                  <p>
                    Current Flow ID: <b>{flowId}</b>
                  </p>
                  <p>
                    Current Flow State: <b>{flowState}</b>{" "}
                  </p>

                  {flowState === "delegate_tx_broadcasting" && (
                    <>
                      <p className={styles.description}>
                        When the signed payload is validated by the Staking API,
                        the flow state changes from <code>initialized</code> to{" "}
                        <code>delegate_tx_broadcasting</code>.<br />
                        <br />
                        At this point, the only action remaining is to check the
                        flow state to ensure it is <code>delegated</code>.
                      </p>
                      <br />
                      <br />
                      <Button
                        type="primary"
                        htmlType="button"
                        onClick={() => setAppState({ stepCompleted: 4 })}
                        href={`/operations/${operation}/flow-state`}
                      >
                        Proceed to the next step &rarr;
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="footer">
            <Link href="/">Return to Main Page</Link>
          </div>

          <Modal
            title="Details"
            width="45%"
            footer={null}
            open={isModalOpen}
            onCancel={handleCancel}
          >
            <ul>
              <li>
                The <code>action</code> at this point of the flow is{" "}
                <code>sign_delegate_tx</code> &mdash; indicating that we need to
                supply the signed transaction payload.
              </li>
              <br />

              <li>
                It is sometimes useful to get an updated transaction payload,
                for which there is another <code>action</code> called{" "}
                <code>refresh_delegate_tx</code>, which generates a new unsigned
                transaction payload.
                <br />
                <b>Note</b>: This is useful for situations where a nonce value
                has increased, or when dealing with flows for <b>Solana</b>,
                where there is a relatively short signing window of around{" "}
                <b>90 seconds</b>
              </li>
              <br />

              <li>
                <b>
                  Once the signed transaction payload is sent to the Staking
                  API, it is then broadcast to the network
                </b>
              </li>
              <br />

              <li>
                The flow state will change from{" "}
                <code>delegate_tx_broadcasting</code> to <code>delegated</code>{" "}
                once the transaction is confirmed on-chain
              </li>
              <br />

              <li>
                Learn how to set up webhooks to be notified of Staking API
                actions in the{" "}
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/figment-networks/figment-apis-demo-app#figment-apis-demo-app"
                >
                  Figment APIs Demo App Tutorial
                </Link>{" "}
                (specifically in{" "}
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/figment-networks/figment-apis-demo-app/blob/tutorial/tutorial.md#step-6-staking-api-webhooks"
                >
                  Step 6
                </Link>
                )
              </li>
              <br />

              <li>
                Learn more about webhooks in the guide{" "}
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://docs.figment.io/guides/staking-api/staking-api-webhooks"
                >
                  Staking API Webhooks
                </Link>
              </li>
              <br />
            </ul>
          </Modal>
        </ConfigProvider>
      </div>
    </>
  );
}
