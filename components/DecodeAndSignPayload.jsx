// @ts-nocheck
import Link from "next/link";
import React, { useState } from "react";
import { Col, Row, Button, Modal, ConfigProvider, Steps } from "antd";
import {
  WarningOutlined,
  SolutionOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import styles from "/styles/Home.module.css";
import Footer from "@components/Footer";

import { useAppState } from "@utilities/appState";

export default function DecodeAndSignPayload({ operation }) {
  const { appState, setAppState } = useAppState();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Destructure state variables
  const {
    flowId,
    flowResponse,
    flowState,
    unsignedTransactionPayload,
    decodedTransactionPayload,
    signedTransactionPayload,
    accountAddress,
    accountPublicKey,
    accountPrivateKey,
    validatorAddress,
    delegateAmount,
    stepCompleted,
  } = appState;

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDecode = async (event) => {
    event.preventDefault();
    const form = event.target;

    // for @figmentio/slate decode function
    const data = {
      transaction_payload: form.transaction_payload.value,
      network: "near",
      operation: "staking",
      version: "v1",
      transaction_name: "delegateTransaction",
    };

    setIsLoading(true);
    const response = await fetch(`/api/${operation}/decode-payload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    setAppState({ decodedTransactionPayload: result });
    setIsLoading(false);
  };

  const handleClearPayload = async () => {
    setAppState({ signedTransactionPayload: undefined });
  };

  const handleResetDecodedPayload = async () => {
    setAppState({ decodedTransactionPayload: undefined });
  };

  const handleResetSignedPayload = async () => {
    setAppState({ signedTransactionPayload: undefined });
  };

  const handleSignature = async () => {
    // Note: This is NOT a production-grade pattern to provide
    // the private key for signing. This is only being done as
    // part of this action to simplify the signing process for
    // the purposes of this walkthrough.
    // Your implementation will need to account for security.
    const data = {
      flow_id: flowId,
      transaction_payload: unsignedTransactionPayload,
      privateKey: accountPrivateKey,
    };

    setIsLoading(true);
    const response = await fetch(`/api/${operation}/sign-payload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    // @ts-ignore
    setAppState({ signedTransactionPayload: result });
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
                current={3}
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
                    status: "process",
                    icon: <SolutionOutlined />,
                  },
                  {
                    title: "Broadcast Transaction",
                    status: "wait",
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

        <h1 className={styles.title}>Decode & Sign Transaction Payloads</h1>

        <Row justify="space-around">
          <Col span={10}>
            <p className={styles.description}>
              After receiving the unsigned <code>transaction_payload</code>, the
              next step is to verify & sign it. Developers can write their own
              verification script, or leverage Figment’s npm package{" "}
              <b>@figmentio/slate</b>.
              <br />
              <Button
                size="large"
                type="primary"
                className={styles.modalButton}
                onClick={() => showModal()}
              >
                Click Here For More Information
              </Button>
            </p>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <form onSubmit={handleDecode} method="post">
              <h3>&darr; Unsigned Transaction Payload</h3>
              <textarea
                style={{
                  padding: "10px",
                  borderRadius: "15px",
                  border: "2px solid #ccc;",
                  fontSize: "0.9rem",
                  background: "rgba(100,100,100,0.2)",
                }}
                id="transaction_payload"
                name="transaction_payload"
                rows={8}
                cols={80}
                required
                defaultValue={unsignedTransactionPayload}
              />
              <br />
              {!signedTransactionPayload && (
                <Button
                  disabled={decodedTransactionPayload}
                  style={{ width: "auto", marginTop: "20px" }}
                  type="primary"
                  htmlType="submit"
                  className={styles.submitButton}
                >
                  Decode Transaction Payload
                </Button>
              )}
              {decodedTransactionPayload && !signedTransactionPayload && (
                <>
                  <br />
                  <h3>&darr; Decoding method from @figmentio/slate</h3>
                  <pre className="payload">
                    const slate = require(&apos;@figmentio/slate&apos;);
                    <br />
                    <span style={{ lineHeight: "2.5rem" }}>
                      await slate.decode(
                      <code>
                        {JSON.stringify(flowResponse?.network_code)}
                      </code>, <code>{JSON.stringify(operation)}</code>,{" "}
                      <code>&quot;v1&quot;</code>,{" "}
                      <code>&quot;delegateTransaction&quot;</code>,{" "}
                      <code>transaction_payload</code>,{" "}
                      <code>
                        &#x7b;<i>options</i>&#x7d;
                      </code>
                      );
                    </span>
                  </pre>
                  <br />
                  <Button
                    type="text"
                    htmlType="button"
                    onClick={() => handleResetDecodedPayload()}
                    icon={<WarningOutlined />}
                    className={styles.resetButton}
                  >
                    Reset Decoded Transaction Payload
                  </Button>
                </>
              )}
              {signedTransactionPayload && (
                <>
                  <br />
                  <h3>
                    Signing method from <b>@figmentio/slate</b>
                  </h3>
                  <pre className="payload" style={{ width: "100%" }}>
                    const slate = require(&apos;@figmentio/slate&apos;);
                    <br />
                    <br />
                    await slate.sign(
                    <code>
                      {JSON.stringify(flowResponse?.network_code)}
                    </code>, <code>&quot;v1&quot;</code>,{" "}
                    <code>transaction_payload</code>, <code>[privateKeys]</code>
                    );
                  </pre>
                  <Button
                    className={styles.resetButton}
                    style={{ width: "auto", marginTop: "20px" }}
                    type="text"
                    htmlType="button"
                    onClick={() => handleResetSignedPayload()}
                    icon={<WarningOutlined />}
                  >
                    Reset Signed Transaction Payload
                  </Button>
                </>
              )}
            </form>
          </Col>

          <Col span={12}>
            {isLoading && <p>Loading...</p>}

            {!decodedTransactionPayload && stepCompleted === 2 && (
              <>
                <p className="spacer">
                  The decoded payload will appear here after you click{" "}
                  <b>Decode Transaction Payload</b>.
                </p>
              </>
            )}
            {decodedTransactionPayload &&
              !isLoading &&
              !signedTransactionPayload &&
              stepCompleted === 2 && (
                <>
                  <br />
                  <p>
                    These are the values submitted to the Staking API for this
                    delegation:
                    <br />
                    <br />
                    Delegator Address: <b>{accountAddress}</b>
                    <br />
                    Delegator Public Key: <b>{accountPublicKey}</b>
                    <br />
                    Validator Address: <b>{validatorAddress}</b>
                    <br />
                    Amount: <b>{delegateAmount}</b>
                    <br />
                    <br />
                    They should match the decoded values below:
                  </p>
                  <h3>&darr; Decoded Transaction Payload</h3>
                  <pre className="payload">
                    {JSON.stringify(decodedTransactionPayload, null, 2)}
                  </pre>

                  {!signedTransactionPayload && (
                    <>
                      <br />
                      {/* Clicking this button will attempt to sign the transaction payload
                          using the private key of the keypair generated by this application. */}
                      <Button
                        className={styles.proceedButton}
                        size="large"
                        type="primary"
                        onClick={() => handleSignature()}
                      >
                        Sign Transaction Payload
                      </Button>
                    </>
                  )}
                </>
              )}

            {signedTransactionPayload && (
              <>
                <br />
                <h3>&darr; Signed Transaction Payload</h3>
                <pre
                  className="payload"
                  onClick={() =>
                    navigator.clipboard.writeText(signedTransactionPayload)
                  }
                >
                  {unsignedTransactionPayload}
                  {/* signature highlight - 
                  
                    signature length for NEAR is 128 characters,
                    appended to the unsigned payload. The output
                    here is identical to signedTransactionPayload
                  */}
                  <span style={{ color: "#FFF29B" }}>
                    {signedTransactionPayload.slice(434, 562)}
                  </span>
                </pre>
                <br />
                <p>
                  <b>@figmentio/slate</b> appends the signature to the
                  transaction payload,
                  <br /> which can now be sent to the Staking API for broadcast
                  to the network.
                </p>
                <br />

                <Button
                  type="primary"
                  htmlType="button"
                  className={styles.proceedButton}
                  href={`/operations/${operation}/broadcast-transaction`}
                  onClick={() => setAppState({ stepCompleted: 3 })}
                >
                  Proceed to the next step &rarr;
                </Button>
                <br />
                <br />
              </>
            )}

            <br />
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
              Current Flow ID:{" "}
              <code>
                <b>{flowId}</b>
              </code>{" "}
              state is{" "}
              <code>
                <b>{flowState}</b>
              </code>
            </li>
            <br />

            <li>
              The unsigned transaction payload can be found in the response from
              the Staking API after submitting data to a flow. Details are
              available in the{" "}
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://docs.figment.io/guides/staking-api/near/delegate/submit-delegate-data"
              >
                Figment Docs
              </Link>
              .
            </li>
            <br />

            <li>
              For more information about decoding and signing payloads, refer to
              the guide{" "}
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://docs.figment.io/guides/staking-api/figment-signing-transactions"
              >
                Signing Transactions with Figment&apos;s npm Package
              </Link>
            </li>
            <br />

            <li>
              If you&apos;re signing with a custodial solution such as the
              Fireblocks API, refer to the guide{" "}
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://docs.figment.io/guides/staking-api/fireblocks-signing-transactions"
              >
                Signing Transactions with the Fireblocks API
              </Link>
            </li>
            <br />

            <li>
              For any network, the payload can be signed by applying the correct
              signing algorithm to the transaction, using a valid keypair. This
              can be accomplished with <b>@figmentio/slate</b>, or Developers
              might choose to write their own solution using a library intended
              for a specific network (ex. Solana&apos;s web3.js, Avalanche.js,
              Polkadot.js, etc.)
            </li>
            <br />

            <li>
              <b>Note</b>: In the context of this application, the private key
              being used to sign the transaction payload is the one{" "}
              <b>
                <i>generated by this app</i>
              </b>
              . This is not a production-grade pattern for handling private
              keys! The signing process used here is only intended to illustrate
              the mechanics of signing.{" "}
              <b>
                Always excercise extreme caution when handling cryptographic
                keypairs, following your organizations security best practices
                at all times.
              </b>
            </li>
            <br />

            <li>
              The signature is appended to the payload. At this point in the
              flow, another request is made to the Staking API, including the
              signed payload. The Staking API then broadcasts the signed
              transaction to the blockchain, completing the flow.
            </li>
          </ul>
        </Modal>
      </ConfigProvider>
    </>
  );
}
