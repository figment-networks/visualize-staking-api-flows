// @ts-nocheck
import Link from "next/link";
import React, { useState } from "react";
import styles from "/styles/Home.module.css";
import { Col, Row, Modal, Steps, Tooltip } from "antd";
import { SolutionOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useAppState } from "@utilities/appState";

import Heading from "@components/elements/Heading";
import ToolTip from "@components/elements/ToolTip";
import Description from "@components/elements/Description";
import Footer from "@components/elements/Footer";

import {
  Title,
  BreadCrumbs,
  Button,
  Card,
  Formatted,
} from "@pages/ui-components";

export default function BroadcastTransaction({ operation }) {
  const { appState, setAppState } = useAppState();
  const { flowId, flowState, signedTransactionPayload } = appState;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const data = {
      flow_id: flowId,
      action: "sign_delegate_tx",
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

    console.log(result);
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
      <BreadCrumbs step={4} />
      <Title title="Broadcast Transaction" />

      <Row justify="space-around">
        <Col span={10}>
          <Card>
            Provide the signed <code>transaction_payload</code> to the Staking
            API. The transaction is then broadcast to the network via the
            Staking APIs dedicated infrastructure.
            <br />
            <Button
              size="large"
              className={styles.modalButton}
              type="text"
              onClick={() => showModal()}
            >
              Click Here For More Information
            </Button>
          </Card>
        </Col>
      </Row>

      <Row className={styles.paddingBottom} justify="space-between">
        <Col span={12}>
          <form onSubmit={handleSubmit} method="post">
            <h6>&darr; Signed Transaction Payload</h6>
            <textarea
              className={styles.decodeTextArea}
              id="signed_payload"
              name="signed_payload"
              required
              defaultValue={signedTransactionPayload}
            />
            <br />

            <Button
              disabled={flowState === "delegate_tx_broadcasting"}
              style={{ width: "auto" }}
              type="primary"
              htmlType="submit"
              className={styles.submitButton}
            >
              Submit Signed Transaction Payload
            </Button>
          </form>
        </Col>

        <Col span={12}>
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
                  <Description>
                    The signed payload has been broadcast to the NEAR network by
                    the Staking API,
                    <br />
                    the flow state changed from <code>initialized</code> to{" "}
                    <code>delegate_tx_broadcasting</code>.<br />
                    <br />
                    At this point in the flow, the only action remaining is to
                    check the flow state to ensure it is <code>delegated</code>.
                  </Description>
                  <br />
                  <Button
                    size="large"
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
            which there is another <code>action</code> named{" "}
            <code>refresh_delegate_tx</code>, which generates a new unsigned
            transaction payload. This can be used for situations where a{" "}
            <Tooltip
              placement="top"
              title={`The word nonce means "a number, used once". Nonces are used to prevent transactions from being replayed.`}
              arrowPointAtCenter
              className={styles.tooltip}
            >
              nonce value
            </Tooltip>{" "}
            has increased, or when dealing with flows for <b>Solana</b>, where
            there is a relatively short signing window of around{" "}
            <b>90 seconds</b>
          </li>
          <br />

          <li>
            <b>
              When the signed transaction payload is sent to the Staking API, it
              is then broadcast to the network
            </b>
          </li>
          <br />

          <li>
            The flow state will change from{" "}
            <code>delegate_tx_broadcasting</code> to <code>delegated</code> once
            the transaction is confirmed on-chain
          </li>
          <br />

          <li>
            If you are interested in going further, learn how to set up webhooks
            to be notified of Staking API actions in the{" "}
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
    </>
  );
}
