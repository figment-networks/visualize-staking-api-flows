// @ts-nocheck
import Link from "next/link";
import React, { useState } from "react";
import { Col, Row, Button, Modal, Steps, Tooltip } from "antd";
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

  const NEARTransactionStructure = `Transaction {
  signerId: 'd2e1eae1e988d036fc8320acaf4dd05cbe677a1c142f49e8.testnet',
  publicKey: PublicKey {
    keyType: 0,
    data: Uint8Array(32) [
        53,  72,  86, 89,  75, 162,  11,  24,
        5, 244,  44, 51, 204, 153,  22, 102,
      229,  26, 165, 44, 207,  21, 179,  77,
      103, 176, 166, 51,  93,  95,  34, 170
    ]
  },
  nonce: <BN: 663b4b558742>,
  receiverId: 'legends.pool.f863973.m0',
  blockHash: Uint8Array(32) [
    139, 192,   0, 253, 253, 160, 141,  37,
      59, 250, 147, 187, 158, 250,  82,  10,
    230,  39, 138, 121, 161, 122, 232,  86,
    190,  29, 255,  98,  60, 130,  71, 231
  ],
  actions: [ Action { functionCall: [FunctionCall], enum: 'functionCall' } ]
}`;

  return (
    <>
      <Row justify="space-around">
        <Col span={24}>
          <div className={styles.header}>
            <Steps
              current={3}
              status="finish"
              type="navigation"
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
            <Tooltip
              placement="bottom"
              title={`Click here to view the package details on npmjs.com in a new tab.`}
              arrowPointAtCenter
              className={styles.tooltip}
            >
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.npmjs.com/package/@figmentio/slate"
              >
                <b>@figmentio/slate</b>
              </Link>
            </Tooltip>
            .
            <br />
            <Button
              size="large"
              type="text"
              className={styles.modalButton}
              onClick={() => showModal()}
            >
              Click Here For More Information
            </Button>
          </p>
        </Col>
      </Row>

      <Row className={styles.paddingBottom}>
        <Col span={12}>
          <form onSubmit={handleDecode} method="post">
            <h3>&darr; Unsigned Transaction Payload</h3>
            <textarea
              style={{
                padding: "10px",
                borderRadius: "15px",
                width: "100%",
                border: "2px solid #ccc",
                fontSize: "medium",
                background: "rgba(100,100,100,0.2)",
              }}
              id="transaction_payload"
              name="transaction_payload"
              rows={8}
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
                          &quot;
                          <Tooltip
                            placement="top"
                            title={`This parameter is the network_code used to create the flow.`}
                            arrowPointAtCenter
                            className={styles.tooltip}
                          >
                            {flowResponse?.network_code}
                          </Tooltip>
                          &quot;
                        </code>
                        ,{" "}
                        <code>
                          &quot;
                          <Tooltip
                            placement="top"
                            title={`This parameter is the operation being used for this flow. NEAR supports staking, unstaking or transfer operations.`}
                            arrowPointAtCenter
                            className={styles.tooltip}
                          >
                            {operation}
                          </Tooltip>
                          &quot;
                        </code>
                        ,{" "}
                        <code>
                          &quot;
                          <Tooltip
                            placement="top"
                            title={`This parameter is the Staking API version used to create the flow.`}
                            arrowPointAtCenter
                            className={styles.tooltip}
                          >
                            v1
                          </Tooltip>
                          &quot;
                        </code>
                        ,{" "}
                        <code>
                          &quot;
                          <Tooltip
                            placement="bottom"
                            title={`This parameter is the transaction type, which relates to the operation being used. Refer to the Figment Docs for details.`}
                            arrowPointAtCenter
                            className={styles.tooltip}
                          >
                            delegateTransaction
                          </Tooltip>
                          &quot;
                        </code>
                        ,{" "}
                        <code>
                          <Tooltip
                            placement="bottom"
                            title={`This parameter is the unsigned transaction payload to be decoded, shown on the left.`}
                            arrowPointAtCenter
                            className={styles.tooltip}
                          >
                            transaction_payload
                          </Tooltip>
                        </code>
                        );
                      </span>
                    </pre>
                  </>
                )}
                <p>
                  These are the values you submitted to the Staking API for this
                  delegation in the previous step:
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
                  They{" "}
                  <Tooltip
                    placement="left"
                    title={`You may notice that the Elliptic Curve Digital Signature Algorithm specifier "ed25519:" is missing from the public key in the decoded payload! This does not prevent the payload from being signed or broadcast. Behind the scenes, the NEAR JavaScript API and the NEAR network itself still recognize the value as a valid public key. Refer to the NEAR documentation for more information on Full Access keypairs.`}
                    arrowPointAtCenter
                    className={styles.tooltip}
                  >
                    should
                  </Tooltip>{" "}
                  match the decoded values below:
                </p>
                <h3>&darr; Decoded Transaction Payload</h3>
                <pre className="payload">
                  {JSON.stringify(decodedTransactionPayload, null, 2)}
                </pre>

                {!signedTransactionPayload && (
                  <>
                    <br />
                    {/* Clicking this button will sign the transaction payload
                          using the private key of the keypair generated by this application. */}
                    <Button
                      className={styles.proceedButton}
                      size="large"
                      type="primary"
                      onClick={() => handleSignature()}
                    >
                      Sign Transaction Payload
                    </Button>
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
              </>
            )}

          {signedTransactionPayload && (
            <>
              <br />
              <h3>
                &darr; Signing method from <b>@figmentio/slate</b>
              </h3>
              <pre className="payload" style={{ width: "100%" }}>
                const slate = require(&apos;@figmentio/slate&apos;);
                <br />
                <br />
                await slate.sign(
                <code>
                  &quot;
                  <Tooltip
                    placement="top"
                    title={`This parameter is the network_code used to create the flow.`}
                    arrowPointAtCenter
                    className={styles.tooltip}
                  >
                    {flowResponse?.network_code}
                  </Tooltip>
                  &quot;
                </code>
                ,{" "}
                <code>
                  &quot;
                  <Tooltip
                    placement="top"
                    title={`This parameter is the Staking API version used to create the flow.`}
                    arrowPointAtCenter
                    className={styles.tooltip}
                  >
                    v1
                  </Tooltip>
                  &quot;
                </code>
                ,{" "}
                <code>
                  <Tooltip
                    placement="top"
                    title={`This parameter is the unsigned transaction payload to be signed, shown on the left.`}
                    arrowPointAtCenter
                    className={styles.tooltip}
                  >
                    transaction_payload
                  </Tooltip>
                </code>
                ,{" "}
                <code>
                  [
                  <Tooltip
                    placement="top"
                    title={`This parameter is an array containing the private key of the delegator account, which is used to sign the transaction. If more than one signature is required, additional keys can be supplied.`}
                    arrowPointAtCenter
                    className={styles.tooltip}
                  >
                    privateKeys
                  </Tooltip>
                  ]
                </code>
                );
              </pre>
            </>
          )}
          {signedTransactionPayload && (
            <>
              <br />
              <h3>&darr; Signed Transaction Payload</h3>
              <pre className="payload">
                <Tooltip
                  placement="left"
                  title={`The blue text is the unsigned transaction payload, also shown on the left.`}
                  arrowPointAtCenter
                  className={styles.tooltipPayload}
                >
                  {/* payload highlight span - 
                  
                    The output unsignedTransactionPayload is given
                    a contrasting color

                    color: "#8FE2DD"
                    color: "#CEFCFF"
                    color: "#FEC70D"
                    color: "#FFF29B"
                    color: "#034d76"
                  */}
                  <span style={{ color: "#8FE2DD" }}>
                    {unsignedTransactionPayload}
                  </span>
                </Tooltip>

                <Tooltip
                  placement="left"
                  title={`The yellow text is the signature, created by signing the payload using the private key of the delegator account.`}
                  arrowPointAtCenter
                  className={styles.tooltipPayload}
                >
                  {/* signature highlight span - 
                  
                    signature length for NEAR is 128 characters,
                    appended to the unsigned payload.
                    This slice appended to the unsigned payload is
                    identical to signedTransactionPayload

                    color: "#8FE2DD"
                    color: "#CEFCFF"
                    color: "#FEC70D"
                    color: "#FFF29B"
                    color: "#034d76"

                  */}
                  <span style={{ color: "#FFF29B" }}>
                    {signedTransactionPayload.slice(434, 562)}
                  </span>
                </Tooltip>
              </pre>
              <br />
              <p>
                <b>@figmentio/slate</b> appends the signature to the unsigned
                transaction payload,
                <br /> which can now be sent to the Staking API for broadcast to
                the network.
              </p>
              <br />
              <Button
                size="large"
                type="primary"
                htmlType="button"
                className={styles.proceedButton}
                href={`/operations/${operation}/broadcast-transaction`}
                onClick={() => setAppState({ stepCompleted: 3 })}
              >
                Proceed to the next step &rarr;
              </Button>
              <br />
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
            The unsigned transaction payload can be found in the response from
            the Staking API after submitting data to a flow. Refer to the{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.figment.io/guides/staking-api/near/delegate/submit-delegate-data"
            >
              Figment Docs
            </Link>{" "}
            for more information
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
            can be accomplished with <b>@figmentio/slate</b>, or developers
            might choose to write their own solution using a library intended
            for a specific network (ex. Solana&apos;s web3.js, Avalanche.js,
            Polkadot.js, etc.)
          </li>
          <br />

          <li>
            The signature is appended to the payload. At this point in the flow,
            another request is made to the Staking API, including the signed
            payload. The Staking API then broadcasts the signed transaction to
            the blockchain, completing the flow.
          </li>
          <br />

          <li>
            <b>Note</b>: In the context of this application, the private key
            being used to sign the transaction payload is the one{" "}
            <b>
              <i>generated by this app</i>
            </b>
            . This is not a production-grade pattern for handling private keys!
            The signing process used here is only intended to illustrate the
            mechanics of signing.{" "}
            <b>
              Always excercise extreme caution when handling cryptographic
              keypairs, following your organizations security best practices at
              all times.
            </b>
          </li>
          <br />
          <li>
            When decoding the payload, you may notice that the public key does
            not have the ECDSA prefix{" "}
            <code>
              <b>ed25519:</b>
            </code>
            . The prefix is part of the string representation of the public key
            &mdash; however this is not maintained when the public key is added
            to the NEAR Transaction object as a byte array. Just be aware that
            an <b>ed25519</b> public key contains 32 bytes which map to a 64
            character account ID (on NEAR this is what&apos;s known as an{" "}
            <b>implicit account</b>).
            <details>
              <summary>
                Click here to view the NEAR Transaction structure
              </summary>
              <br />
              The public key shown in this transaction has a{" "}
              <code>keyType</code> of 0, indicating an <code>ed25519</code>{" "}
              keypair.
              <br />
              Check out the relevant NEAR JavaScript API code{" "}
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/near/near-api-js/blob/master/packages/near-api-js/src/utils/key_pair.ts#L13"
              >
                HERE
              </Link>
              <br />
              <br />
              <pre className="payload">{NEARTransactionStructure}</pre>
            </details>
          </li>
        </ul>
      </Modal>
    </>
  );
}
