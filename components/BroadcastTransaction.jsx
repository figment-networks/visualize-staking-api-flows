// @ts-nocheck

import Link from "next/link";
import React, { useState } from "react";
import styles from "/styles/Home.module.css";
import { Col, Row, Button, Modal, ConfigProvider, Steps } from "antd";
import { SolutionOutlined, CheckCircleOutlined } from "@ant-design/icons";
import Footer from "@components/Footer";

import { useAppState } from "@utilities/appState";

export default function BroadcastTransaction({ operation }) {
  const { appState, setAppState } = useAppState();
  const { flowId, flowState, signedTransactionPayload } = appState;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const data = {
      flow_id: flowId,
      action: form.flowAction.value,
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
      setAppState({ flowState: result.state });
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#0D858B", // Primary button color
            colorError: "#C90000", // Used when button has a danger property set
          },
        }}
      >
        <Row justify="space-around">
          <Col span={24}>
            <div className={styles.header}>
              <Steps
                current={4}
                status="finish"
                type="navigation"
                className={(styles.description, styles.progress)}
                items={[
                  {
                    title: "Create Account",
                    status: "finish",
                    icon: <CheckCircleOutlined />,
                    onClick: () => {},
                  },
                  {
                    title: "Create a Flow",
                    status: "finish",
                    icon: <CheckCircleOutlined />,
                  },
                  {
                    title: "Submit Data",
                    status: "finish",
                    icon: <CheckCircleOutlined />,
                  },
                  {
                    title: "Decode & Sign Payload",
                    status: "finish",
                    icon: <CheckCircleOutlined />,
                  },
                  {
                    title: "Broadcast Transaction",
                    status: "process",
                    icon: <SolutionOutlined />,
                  },
                  {
                    title: "Get Flow State",
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

        <h1 className={styles.title}>Broadcast Transaction</h1>

        <Row justify="space-around">
          <Col span={10}>
            <p className={styles.description}>
              Provide the signed <code>transaction_payload</code> to the Staking
              API. The transaction is then broadcast to the network via the
              Staking APIs dedicated infrastructure.
              <br />
              <Button
                size="large"
                className={styles.modalButton}
                type="primary"
                onClick={() => showModal()}
              >
                Click Here For More Information
              </Button>
            </p>
          </Col>
        </Row>

        <Row className={styles.paddingBottom} justify="space-between">
          <Col span={12}>
            <form onSubmit={handleSubmit} method="post">
              <label htmlFor="action" className={styles.leftLabel}>
                Action:
              </label>
              <select
                required
                id="action"
                name="flowAction"
                defaultValue="sign_delegate_tx"
                style={{ width: "200px" }}
              >
                <option value="sign_delegate_tx">sign_delegate_tx</option>
                <option disabled value="refresh_delegate_tx">
                  refresh_delegate_tx
                </option>
              </select>

              <br />

              <h3>&darr; Signed Transaction Payload</h3>

              <textarea
                style={{
                  padding: "10px",
                  borderRadius: "15px",
                  border: "2px solid #ccc;",
                  fontSize: "0.9rem",
                  width: "100%",
                  background: "rgba(100,100,100,0.2)",
                }}
                id="signed_payload"
                name="signed_payload"
                rows={8}
                required
                defaultValue={signedTransactionPayload}
              />
              <br />
              <br />

              <Button
                disabled={flowState === "delegate_tx_broadcasting"}
                style={{ width: "auto" }}
                type="primary"
                htmlType="submit"
              >
                Submit Signed Transaction Payload
              </Button>
            </form>
            {/* </div> */}
          </Col>

          <Col span={12}>
            {/* <div className="column"> */}
            {flowState && (
              <>
                <br />
                <br />
                <p>
                  Flow ID:{" "}
                  <code>
                    <b>{flowId}</b>
                  </code>
                </p>
                <p>
                  Flow state:{" "}
                  <code>
                    <b>{flowState}</b>
                  </code>{" "}
                </p>

                {flowState === "delegate_tx_broadcasting" && (
                  <>
                    <p
                      className={styles.description}
                      style={{ width: "700px" }}
                    >
                      The signed payload has been broadcast to the NEAR network
                      by the Staking API,
                      <br />
                      the flow state changed from <code>
                        initialized
                      </code> to <code>delegate_tx_broadcasting</code>.<br />
                      <br />
                      At this point in the flow, the only action remaining is to
                      check the flow state to ensure it is{" "}
                      <code>delegated</code>.
                    </p>
                    <br />
                    <Button
                      type="primary"
                      htmlType="button"
                      className={styles.proceedButton}
                      onClick={() => setAppState({ stepCompleted: 4 })}
                      href={`/operations/${operation}/flow-state`}
                    >
                      Proceed to the next step &rarr;
                    </Button>
                  </>
                )}
              </>
            )}
            {/* </div> column */}
            {/* </div> row */}
          </Col>
        </Row>

        <Footer />

        <Modal
          title="Details"
          width="calc(40% - 10px)"
          footer={null}
          open={isModalOpen}
          onCancel={closeModal}
        >
          <ul>
            <li>
              The <code>action</code> at this point of the flow is{" "}
              <code>sign_delegate_tx</code> &mdash; indicating that we need to
              supply the signed transaction payload.
            </li>
            <br />

            <li>
              It is sometimes useful to get an updated transaction payload, for
              which there is another <code>action</code> called{" "}
              <code>refresh_delegate_tx</code>, which generates a new unsigned
              transaction payload.
              <br />
              <b>Note</b>: This is useful for situations where a nonce value has
              increased, or when dealing with flows for <b>Solana</b>, where
              there is a relatively short signing window of around{" "}
              <b>90 seconds</b>
            </li>
            <br />

            <li>
              <b>
                Once the signed transaction payload is sent to the Staking API,
                it is then broadcast to the network
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
              Learn how to set up webhooks to be notified of Staking API actions
              in the{" "}
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
    </>
  );
}
