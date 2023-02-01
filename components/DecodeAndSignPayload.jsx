// @ts-nocheck
import Link from "next/link";
import React, { useState } from "react";
import { Col, Row, Modal } from "antd";
import { useAppState } from "@utilities/appState";
import styles from "/styles/Home.module.css";

import ToolTip from "@components/elements/ToolTip";

import {
  Title,
  BreadCrumbs,
  Button,
  Card,
  Formatted,
  Footer,
} from "@pages/ui-components";

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
      <BreadCrumbs step={3} />
      <Title title="Decode & Sign Transaction Payloads" />

      <Card maxWidth="800px">
        <p>
          After receiving the unsigned{" "}
          <Formatted>transaction_payload</Formatted>, the next step is to verify
          & sign it. Developers can write their own verification script, or
          leverage Figment’s npm package{" "}
          <ToolTip
            placement="top"
            title={`Click here to view the package details on npmjs.com in a new tab.`}
          >
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.npmjs.com/package/@figmentio/slate"
            >
              <b>@figmentio/slate</b>
            </Link>
          </ToolTip>
          .
        </p>
        <br />
        <Button onClick={() => showModal()}>
          Click Here For More Information
        </Button>
      </Card>

      <Row className={styles.paddingBottom}>
        <form onSubmit={handleDecode} method="post">
          <h6>&darr; Unsigned Transaction Payload</h6>
          <textarea
            className={styles.decodeTextArea}
            id="transaction_payload"
            name="transaction_payload"
            defaultValue={unsignedTransactionPayload}
            required
          />
          <br />
          {!signedTransactionPayload && (
            <Button>Decode Transaction Payload</Button>
          )}
        </form>

        <Col span={12}>
          {!decodedTransactionPayload && stepCompleted === 2 && (
            <>
              <p className={styles.spacer}>
                {isLoading && <p>Decoding Payload...</p>}
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
                    <h6>&darr; Decoding method from @figmentio/slate</h6>
                    <Formatted block>
                      const slate = require(&apos;@figmentio/slate&apos;);
                      <br /> <br />
                      <span>
                        await slate.decode(
                        <Formatted>
                          &quot;
                          <ToolTip
                            placement="top"
                            title={`This parameter is the network_code used to create the flow.`}
                          >
                            {flowResponse?.network_code}
                          </ToolTip>
                          &quot;
                        </Formatted>
                        ,{" "}
                        <ToolTip
                          placement="top"
                          title={`This parameter is the operation being used for this flow. NEAR supports staking, unstaking or transfer operations.`}
                        >
                          <Formatted>
                            &quot;
                            {operation}
                            &quot;
                          </Formatted>
                        </ToolTip>
                        ,{" "}
                        <ToolTip
                          placement="top"
                          title={`This parameter is the Staking API version used to create the flow.`}
                        >
                          <Formatted>&quot;v1&quot;</Formatted>
                        </ToolTip>
                        ,{" "}
                        <ToolTip
                          placement="bottom"
                          title={`This parameter is the transaction type, which relates to the operation being used. Refer to the Figment Docs for details.`}
                        >
                          <Formatted>
                            &quot; delegateTransaction &quot;
                          </Formatted>
                        </ToolTip>
                        ,{" "}
                        <ToolTip
                          placement="bottom"
                          title={`This parameter is the unsigned transaction payload to be decoded, shown on the left.`}
                        >
                          <Formatted>transaction_payload</Formatted>
                        </ToolTip>
                        );
                      </span>
                    </Formatted>
                  </>
                )}
                <p>
                  These are the values you submitted to the Staking API for this
                  delegation in the previous step:
                </p>
                <p>
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
                  <ToolTip
                    placement="left"
                    title={`You may notice that the Elliptic Curve Digital Signature Algorithm specifier "ed25519:" is missing from the public key in the decoded payload! This does not prevent the payload from being signed or broadcast. Behind the scenes, the NEAR JavaScript API and the NEAR network itself still recognize the value as a valid public key. Refer to the NEAR documentation for more information on Full Access keypairs.`}
                  >
                    should
                  </ToolTip>{" "}
                  match the decoded values below:
                </p>
                <h6>&darr; Decoded Transaction Payload</h6>
                <Formatted block>
                  {JSON.stringify(decodedTransactionPayload, null, 2)}
                </Formatted>

                {!signedTransactionPayload && (
                  <>
                    <br />
                    {/* Clicking this button will sign the transaction payload
                          using the private key of the keypair generated by this application. */}
                    <Button
                      size="large"
                      type="primary"
                      onClick={() => handleSignature()}
                    >
                      Sign Transaction Payload
                    </Button>
                    <br />
                    <Button
                      destructive
                      type="text"
                      htmlType="button"
                      onClick={() => handleResetDecodedPayload()}
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
              <h6>
                &darr; Signing method from <b>@figmentio/slate</b>
              </h6>
              <pre className={styles.payload}>
                const slate = require(&apos;@figmentio/slate&apos;);
                <br />
                <br />
                await slate.sign(
                <Formatted>
                  &quot;
                  <ToolTip
                    placement="top"
                    title={`This parameter is the network_code used to create the flow.`}
                  >
                    {flowResponse?.network_code}
                  </ToolTip>
                  &quot;
                </Formatted>
                ,{" "}
                <Formatted>
                  &quot;
                  <ToolTip
                    placement="top"
                    title={`This parameter is the Staking API version used to create the flow.`}
                  >
                    v1
                  </ToolTip>
                  &quot;
                </Formatted>
                ,{" "}
                <Formatted>
                  <ToolTip
                    placement="top"
                    title={`This parameter is the unsigned transaction payload to be signed, shown on the left.`}
                  >
                    transaction_payload
                  </ToolTip>
                </Formatted>
                ,{" "}
                <Formatted>
                  [
                  <ToolTip
                    placement="top"
                    title={`This parameter is an array containing the private key of the delegator account, which is used to sign the transaction. If more than one signature is required, additional keys can be supplied.`}
                  >
                    privateKeys
                  </ToolTip>
                  ]
                </Formatted>
                );
              </pre>
            </>
          )}
          {signedTransactionPayload && (
            <>
              <br />
              <h6>&darr; Signed Transaction Payload</h6>
              <Formatted block>
                <ToolTip
                  placement="left"
                  title={`The blue text is the unsigned transaction payload, also shown on the left.`}
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
                </ToolTip>

                <ToolTip
                  placement="left"
                  title={`The yellow text is the signature, created by signing the payload using the private key of the delegator account.`}
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
                </ToolTip>
              </Formatted>
              <br />
              <p>
                <b>@figmentio/slate</b> appends the signature to the unsigned
                transaction payload,
                <br /> which can now be sent to the Staking API for broadcast to
                the network.
              </p>
              <br />
              <Button
                href={`/operations/${operation}/broadcast-transaction`}
                onClick={() => setAppState({ stepCompleted: 3 })}
              >
                Proceed to the next step &rarr;
              </Button>
              <br />
              <Button destructive onClick={() => handleResetSignedPayload()}>
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
            <Formatted>
              <b>ed25519:</b>
            </Formatted>
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
              <Formatted>keyType</Formatted> of 0, indicating an{" "}
              <Formatted>ed25519</Formatted> keypair.
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
              <Formatted block maxHeight="315px">
                {NEARTransactionStructure}
              </Formatted>
            </details>
          </li>
        </ul>
      </Modal>
    </>
  );
}
