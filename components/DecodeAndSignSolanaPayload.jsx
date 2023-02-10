// @ts-nocheck
import React, { useState } from "react";
import Link from "next/link";
import { Modal } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import {
  DESCRIPTION,
  Head,
  Title,
  BreadCrumbs,
  Button,
  Card,
  Formatted,
  LayoutColumn,
  Footer,
  ToolTip,
} from "@components/ui-components";

import { useAppState } from "@utilities/appState";

export default function DecodeAndSignSolanaPayload({ operation }) {
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
    sol_accountPublicKey,
    sol_accountPrivateKey,
    sol_createStakeAccountAmount,
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
      network: "solana",
      operation: "staking",
      version: "v1",
      transaction_name: "createStakeAccountTransaction",
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
      privateKey: sol_accountPrivateKey,
    };

    setIsLoading(true);
    const response = await fetch(`/api/sol-staking/sign-payload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    setIsLoading(false);

    setAppState({ signedTransactionPayload: result });
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

  const title = "Decode & Sign Transaction Payloads (SOL)";

  return (
    <>
      <Head title={title} description={DESCRIPTION} />
      <BreadCrumbs step={3} />

      <LayoutColumn title={<Title>{title}</Title>}>
        <LayoutColumn.Column
          style={{
            padding: "0",
            flexShrink: "0",
            width: "100%",
            marginBottom: "2.4rem",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Card small>
            {!unsignedTransactionPayload && (
              <>
                <p>
                  No unsigned transaction payload is available to decode or
                  sign. Please complete the previous step, <b>Submit Data</b>.
                </p>
                <Button
                  small
                  href={`/operations/${operation}/submit-data`}
                  style={{
                    display: "block",
                    margin: "0 auto",
                    marginTop: "2rem",
                  }}
                >
                  &larr; Go Back
                </Button>
              </>
            )}
            {unsignedTransactionPayload && (
              <>
                <p>
                  After receiving the unsigned{" "}
                  <Formatted>transaction_payload</Formatted> from the Staking
                  API, the next step is to verify & sign it.
                </p>

                <p>
                  Developers can write their own verification script, or
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
                <Button secondary small onClick={() => showModal()}>
                  Click Here For More Information
                </Button>
              </>
            )}
          </Card>
        </LayoutColumn.Column>

        <LayoutColumn.Column
          style={{
            padding: "0",
            flexShrink: "0",
            width: "30%",
            marginBottom: "2.4rem",
          }}
        >
          {unsignedTransactionPayload && (
            <>
              <form onSubmit={handleDecode} method="post">
                <h6>&darr; Unsigned Transaction Payload</h6>
                <textarea
                  className="textArea"
                  id="transaction_payload"
                  name="transaction_payload"
                  defaultValue={unsignedTransactionPayload}
                  required
                />
                <br />
                {!signedTransactionPayload && (
                  <Button type="submit">Decode Transaction Payload</Button>
                )}
              </form>
            </>
          )}
        </LayoutColumn.Column>

        <LayoutColumn.Column>
          {!decodedTransactionPayload && unsignedTransactionPayload && (
            <>
              <br />
              <br />
              <p className="spacer">
                {isLoading && (
                  <>
                    <p>
                      <LoadingOutlined /> Decoding Payload...
                    </p>
                  </>
                )}
                The decoded payload will appear here after you click{" "}
                <b>Decode Transaction Payload</b>.
              </p>
            </>
          )}
          {decodedTransactionPayload &&
            !isLoading &&
            !signedTransactionPayload && (
              <>
                {decodedTransactionPayload && !signedTransactionPayload && (
                  <Card medium>
                    <h6>&darr; Decoding method from @figmentio/slate</h6>
                    <Formatted block>
                      <span>
                        const slate = require(&apos;@figmentio/slate&apos;);
                        <br /> <br />
                        await slate.decode(
                        <Formatted>
                          &quot;
                          <ToolTip
                            style={{ textDecoration: "underline" }}
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
                            style={{ textDecoration: "underline" }}
                            title={`This parameter is the operation being used for this flow. NEAR supports staking, unstaking or transfer operations.`}
                          >
                            {operation}
                          </ToolTip>
                          &quot;
                        </Formatted>
                        ,{" "}
                        <Formatted>
                          &quot;
                          <ToolTip
                            style={{ textDecoration: "underline" }}
                            title={`This parameter is the Staking API version used to create the flow.`}
                          >
                            v1
                          </ToolTip>
                          &quot;
                        </Formatted>
                        ,{" "}
                        <Formatted>
                          &quot;
                          <ToolTip
                            style={{ textDecoration: "underline" }}
                            title={`This parameter is the transaction type, which relates to the operation being used. Refer to the Figment Docs for details.`}
                          >
                            createStakeAccountTransaction
                          </ToolTip>
                          &quot;
                        </Formatted>
                        ,{" "}
                        <Formatted>
                          <ToolTip
                            style={{ textDecoration: "underline" }}
                            title={`This parameter is the unsigned transaction payload to be decoded, shown on the left.`}
                          >
                            transaction_payload
                          </ToolTip>
                        </Formatted>
                        );
                      </span>
                    </Formatted>
                  </Card>
                )}
                <Card medium>
                  <p>
                    These are the values sent to the Staking API for this
                    delegation in the <b>Submit Data</b> step:
                  </p>
                  <p>
                    <table style={{ width: "100%" }}>
                      <thead>
                        <tr>
                          <th>Input</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Funding Account Public Key</td>
                          <td>
                            <b>{sol_accountPublicKey}</b>
                          </td>
                        </tr>
                        <tr>
                          <td>Stake Authority Public Key</td>
                          <td>
                            <b>{sol_accountPublicKey}</b>
                          </td>
                        </tr>
                        <tr>
                          <td>Withdraw Authority Public Key</td>
                          <td>
                            <b>{sol_accountPublicKey}</b>
                          </td>
                        </tr>
                        <tr>
                          <td>Amount</td>
                          <td>
                            <b>{sol_createStakeAccountAmount}</b>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </p>
                  <p>They should match the decoded values below:</p>
                  <h6>&darr; Decoded Transaction Payload</h6>
                  <ToolTip
                    placement="left"
                    title={`You may notice that the amount for the Staking Account is shown in Lamports. A single SOL can be broken down into one billion Lamports.`}
                  >
                    <Formatted block>
                      {JSON.stringify(decodedTransactionPayload, null, 2)}
                    </Formatted>
                  </ToolTip>
                </Card>
                {!signedTransactionPayload && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <Button
                        secondary
                        onClick={() => handleResetDecodedPayload()}
                      >
                        Reset Decoded Transaction Payload
                      </Button>
                      <ToolTip
                        placement="top"
                        title={`Clicking this button will sign the payload using the private key of the NEAR testnet account generated by this app.`}
                      >
                        <Button onClick={() => handleSignature()}>
                          Sign Transaction Payload
                        </Button>
                      </ToolTip>
                    </div>
                    <br />
                    <br />
                  </>
                )}
              </>
            )}

          <>
            {signedTransactionPayload && (
              <Card medium>
                <h6>
                  &darr; Signing method from <b>@figmentio/slate</b>
                </h6>
                <Formatted block>
                  const slate = require(&apos;@figmentio/slate&apos;);
                  <br />
                  <br />
                  await slate.sign(
                  <Formatted>
                    &quot;
                    <ToolTip
                      style={{ textDecoration: "underline" }}
                      placement="bottom"
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
                      style={{ textDecoration: "underline" }}
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
                      style={{ textDecoration: "underline" }}
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
                      style={{ textDecoration: "underline" }}
                      placement="top"
                      title={`This parameter is an array containing the private key of the delegator account, which is used to sign the transaction. If more than one signature is required, additional keys can be supplied.`}
                    >
                      privateKeys
                    </ToolTip>
                    ]
                  </Formatted>
                  );
                </Formatted>
              </Card>
            )}

            {signedTransactionPayload && (
              <>
                <Card medium justify>
                  <h6>&darr; Signed Transaction Payload</h6>
                  <p>
                    When used to sign a payload, <b>@figmentio/slate</b> appends
                    the signature to the unsigned transaction payload. In the
                    next step, you can send this signed payload to the Staking
                    API to be broadcast to the network. Mouseover the different
                    colored sections of the payload below.
                  </p>

                  <Formatted block contrast>
                    <ToolTip
                      placement="top"
                      title={`This portion is the unsigned transaction payload, also shown on the left.`}
                    >
                      {/* payload highlight span - 
                  
                    The output unsignedTransactionPayload is given
                    a contrasting color

                    color: "#8FE2DD"
                    color: "#CEFCFF"
                    color: "#FEC70D"
                    color: "#FFF29B"
                    color: "#034d76"
                    color: "#10726d"
                  */}
                      <span style={{ color: "#10726d" }}>
                        {unsignedTransactionPayload}
                      </span>
                    </ToolTip>

                    <ToolTip
                      placement="bottom"
                      title={`This portion is the signature, created by signing the payload using the private key of the delegator account.`}
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
                    color: "#a7431b"
                  */}
                      <span style={{ color: "#a7431f", background: "rgba" }}>
                        {signedTransactionPayload.slice(434, 562)}
                      </span>
                    </ToolTip>
                  </Formatted>
                  <br />
                </Card>
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <Button secondary onClick={() => handleResetSignedPayload()}>
                    Reset Signed Transaction Payload
                  </Button>
                  <Button
                    href={`/operations/sol-staking/broadcast-transaction`}
                    onClick={() => setAppState({ stepCompleted: 3 })}
                  >
                    Proceed to the next step &rarr;
                  </Button>
                </div>
              </>
            )}
          </>
        </LayoutColumn.Column>

        <Footer />
      </LayoutColumn>

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
            the blockchain, completing the flow
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
              all times
            </b>
          </li>
          <br />
          <li>
            When decoding the payload, you may notice that the public key does
            not have the ECDSA prefix{" "}
            <Formatted>
              <b>ed25519:</b>
            </Formatted>
            . This does not prevent the payload from being signed or broadcast.
            The prefix is part of the string representation of the public key
            &mdash; however this is not maintained when the public key is added
            to the NEAR Transaction object as a byte array. Just be aware that
            an <b>ed25519</b> public key contains 32 bytes which map to a 64
            character account ID (on NEAR this is what&apos;s known as an{" "}
            <b>implicit account</b>)
            <details>
              <summary>
                Click here to view the NEAR Transaction structure
              </summary>
              <p>
                The public key shown in this transaction has a{" "}
                <Formatted>keyType</Formatted> of 0, indicating an{" "}
                <Formatted>ed25519</Formatted> keypair. You will find the
                relevant NEAR JavaScript API code{" "}
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/near/near-api-js/blob/master/packages/near-api-js/src/utils/key_pair.ts#L13"
                  style={{ textDecoration: "underline" }}
                >
                  HERE
                </Link>
                .
              </p>
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
