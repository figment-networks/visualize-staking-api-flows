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
  const [custodialSigningPage, setCustodialSigningPage] = useState(false);
  const [isCustodialSigningModalOpen, setIsCustodialSigningModalOpen] =
    useState(false);

  // Destructure state variables
  const {
    flowId,
    flowResponse,
    unsignedTransactionPayload,
    decodedTransactionPayload,
    signedTransactionPayload,
    unsignedSigningPayload,
    decodedSigningPayload,
    signedSigningPayload,
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

  const showCustodialSigningModal = () => {
    setIsCustodialSigningModalOpen(true);
  };

  const closeCustodialSigningModal = () => {
    setIsCustodialSigningModalOpen(false);
  };

  const handleDecode = async (event) => {
    event.preventDefault();
    const form = event.target;

    // for @figmentio/slate decode function
    const data = {
      transaction_payload:
        form.transaction_payload?.value || form.signing_payload?.value,
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
    const response = await fetch(`/api/staking/sign-payload`, {
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

  const handleResetSignedPayload = async () => {
    setAppState({ signedTransactionPayload: undefined });
  };

  const title = "Decode & Sign Transaction Payloads";

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
            {custodialSigningPage ? (
              <>
                <p>
                  Custodial signing of transactions within Staking API flows,
                  for example using the{" "}
                  <Link
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://docs.fireblocks.com/api/#introduction"
                  >
                    Fireblocks API
                  </Link>
                  , differs from non-custodial signing.
                </p>
                <p>
                  After receiving the unsigned{" "}
                  <Formatted>signing_payload</Formatted> from the Staking API,
                  the next step is to send it to the Fireblocks API for signing.
                </p>
                <p>
                  <b>Note</b>: The <Formatted>signing_payload</Formatted> is a
                  hashed version of the{" "}
                  <Formatted>transaction_payload</Formatted>.{" "}
                  <b>@figmentio/slate</b> does not support decoding the signing
                  payload directly.
                </p>
                <Button
                  secondary
                  small
                  onClick={() => showCustodialSigningModal()}
                >
                  Click Here For More Information
                </Button>
                <br />
              </>
            ) : (
              <>
                {!unsignedTransactionPayload && (
                  <>
                    <p>
                      No unsigned transaction payload is available to decode or
                      sign. Please complete the previous step,{" "}
                      <b>Submit Data</b>.
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
                      <Formatted>transaction_payload</Formatted> from the
                      Staking API, the next step is to decode it for
                      verification before signing it with the necessary private
                      key(s).
                    </p>

                    <p></p>

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
                    <br />
                  </>
                )}
              </>
            )}

            {custodialSigningPage ? (
              <>
                <Button
                  secondary
                  small
                  onClick={() => {
                    setCustodialSigningPage(false);
                  }}
                >
                  Click Here To Explore Non-Custodial Signing
                </Button>
              </>
            ) : (
              <>
                <Button
                  secondary
                  small
                  onClick={() => {
                    setCustodialSigningPage(true);
                  }}
                >
                  Click Here To Explore Custodial Signing
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
          {custodialSigningPage && (
            <Card small>
              <form onSubmit={handleDecode} method="post">
                <h6>&darr; Signing Payload</h6>
                <textarea
                  className="textArea"
                  id="signing_payload"
                  name="signing_payload"
                  // defaultValue={unsignedSigningPayload}
                  defaultValue={
                    flowResponse?.actions[1]?.inputs[1].signing_payload
                  }
                  required
                />
                <br />
                {/* <Button
                  disabled={decodedSigningPayload || signedSigningPayload}
                  type="submit"
                >
                  Decode Signing Payload
                </Button> */}
              </form>
            </Card>
          )}
          {unsignedTransactionPayload && !custodialSigningPage && (
            <Card small>
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
                <Button
                  disabled={
                    decodedTransactionPayload || signedTransactionPayload
                  }
                  type="submit"
                >
                  Decode Transaction Payload
                </Button>
              </form>
            </Card>
          )}
        </LayoutColumn.Column>

        <LayoutColumn.Column>
          {custodialSigningPage && (
            <>
              <Card small>
                <p>
                  The <Formatted>signing_payload</Formatted> is located in the{" "}
                  <Formatted>signatures</Formatted> input of the{" "}
                  <Formatted>sign_stake_account_tx</Formatted> action in the
                  Staking API response. For other networks and flows, the{" "}
                  <Formatted>signing_payload</Formatted> will be located in the
                  relevant signing action.
                  <br />
                  <details>
                    <summary>
                      Click to view the relevant portion of the Staking API
                      response
                    </summary>
                    <Formatted block>
                      {JSON.stringify(
                        flowResponse?.actions[1].inputs[1],
                        null,
                        2
                      )}
                    </Formatted>
                  </details>
                </p>
                <p>
                  Follow the guide{" "}
                  <Link
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://docs.figment.io/guides/staking-api/fireblocks-signing-transactions"
                  >
                    Signing Transactions with the Fireblocks API
                  </Link>{" "}
                  if you require a custodial signing solution. This app does not
                  currently support signing using the Fireblocks API.
                </p>
                <Button
                  small
                  onClick={() => {
                    setCustodialSigningPage(false);
                  }}
                >
                  Continue with Non-Custodial Signing
                </Button>
              </Card>
            </>
          )}
          {!custodialSigningPage &&
            !decodedTransactionPayload &&
            unsignedTransactionPayload && (
              <>
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
                <Card medium>
                  {decodedTransactionPayload && !signedTransactionPayload && (
                    <>
                      <p>
                        These are the values sent to the Staking API for this
                        flow in the <b>Submit Data</b> step.{" "}
                        <p>They should match the decoded values below.</p>
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

                      <h6>&darr; Decoding method from @figmentio/slate</h6>
                      <Formatted block>
                        <span>
                          const slate = require(&apos;@figmentio/slate&apos;);
                          <br /> <br />
                          await slate.decode(
                          <Formatted>
                            &quot;
                            <ToolTip
                              style={{
                                textDecoration: "underline dotted",
                                cursor: "help",
                              }}
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
                              style={{
                                textDecoration: "underline dotted",
                                cursor: "help",
                              }}
                              title={`This parameter is the operation being used for this flow. Solana supports staking, unstaking, transfer, as well as split or merge stake account operations.`}
                            >
                              {operation}
                            </ToolTip>
                            &quot;
                          </Formatted>
                          ,{" "}
                          <Formatted>
                            &quot;
                            <ToolTip
                              style={{
                                textDecoration: "underline dotted",
                                cursor: "help",
                              }}
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
                              style={{
                                textDecoration: "underline dotted",
                                cursor: "help",
                              }}
                              title={`This parameter is the transaction type, which relates to the operation being used. Refer to the Figment Docs for details.`}
                            >
                              createStakeAccountTransaction
                            </ToolTip>
                            &quot;
                          </Formatted>
                          ,{" "}
                          <Formatted>
                            <ToolTip
                              style={{
                                textDecoration: "underline dotted",
                                cursor: "help",
                              }}
                              title={`This parameter is the unsigned transaction payload to be decoded, shown on the left.`}
                            >
                              transaction_payload
                            </ToolTip>
                          </Formatted>
                          );
                        </span>
                      </Formatted>
                    </>
                  )}
                  <h6>&darr; Decoded Transaction Payload</h6>
                  <ToolTip
                    placement="left"
                    title={`You may notice that the amount for the Staking Account is shown in Lamports. A single SOL can be broken down into one billion Lamports.`}
                  >
                    <Formatted block>
                      {JSON.stringify(decodedTransactionPayload, null, 2)}
                    </Formatted>
                  </ToolTip>
                  {!signedTransactionPayload && (
                    <>
                      <br />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                        }}
                      >
                        <ToolTip title={`Click here to reset the payload.`}>
                          <Button
                            secondary
                            onClick={() => handleResetDecodedPayload()}
                          >
                            Reset Decoded Transaction Payload
                          </Button>
                        </ToolTip>

                        <ToolTip
                          title={`Clicking this button will sign the payload using the private key of the Solana devnet account generated by this app.`}
                        >
                          <Button small onClick={() => handleSignature()}>
                            Sign Transaction Payload
                          </Button>
                        </ToolTip>
                      </div>
                    </>
                  )}
                </Card>
              </>
            )}

          <>
            {signedTransactionPayload && (
              <>
                <Card medium justify>
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
                        style={{
                          textDecoration: "underline dotted",
                          cursor: "help",
                        }}
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
                        style={{
                          textDecoration: "underline dotted",
                          cursor: "help",
                        }}
                        title={`This parameter is the Staking API version used to create the flow.`}
                      >
                        v1
                      </ToolTip>
                      &quot;
                    </Formatted>
                    ,{" "}
                    <Formatted>
                      <ToolTip
                        style={{
                          textDecoration: "underline dotted",
                          cursor: "help",
                        }}
                        title={`This parameter is the unsigned transaction payload to be signed, shown on the left.`}
                      >
                        transaction_payload
                      </ToolTip>
                    </Formatted>
                    ,{" "}
                    <Formatted>
                      [
                      <ToolTip
                        style={{
                          textDecoration: "underline dotted",
                          cursor: "help",
                        }}
                        title={`This parameter is an array containing the private key of the delegator account, which is used to sign the transaction. If more than one signature is required, additional keys can be supplied.`}
                      >
                        privateKeys
                      </ToolTip>
                      ]
                    </Formatted>
                    );
                  </Formatted>

                  <h6>&darr; Signed Transaction Payload</h6>
                  <p>
                    When used to sign a payload on Solana,{" "}
                    <b>@figmentio/slate</b> adds the signature to the beginning
                    of the unsigned transaction payload. The payload size
                    remains constant. In the next step, you can send this signed
                    payload to the Staking API to be broadcast to the network.
                    Mouseover the different colored sections of the payload
                    below.
                  </p>

                  <Formatted block contrast>
                    <ToolTip
                      placement="top"
                      title={`This portion is the signature, created by signing the payload using the private key of the delegator account. It is inserted in the first 130 characters of the transaction payload.`}
                    >
                      {/* signature highlight span - 
                  
                    signature length for Solana is 130 characters,
                    added to the beginning of the unsigned payload.
                    This slice prepended to the unsigned payload is
                    identical to signedTransactionPayload

                    color: "#8FE2DD"
                    color: "#CEFCFF"
                    color: "#FEC70D"
                    color: "#FFF29B"
                    color: "#034d76"
                    color: "#a7431b"
                  */}
                      <span style={{ color: "#a7431f" }}>
                        {signedTransactionPayload.slice(0, 130)}
                      </span>
                    </ToolTip>

                    <ToolTip
                      placement="bottom"
                      title={`This portion is the remainder of the transaction payload, also shown on the left. You'll notice that the first 130 characters of the unsigned payload are mostly zeroes.`}
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

                      <span style={{ color: "#10726d", background: "rgba" }}>
                        {signedTransactionPayload.slice(130, 1008)}
                      </span>
                    </ToolTip>
                  </Formatted>
                  <br />
                  <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    <ToolTip title={`Click here to reset the payload.`}>
                      <Button
                        secondary
                        onClick={() => handleResetSignedPayload()}
                      >
                        Reset Signed Transaction Payload
                      </Button>
                    </ToolTip>
                    <Button
                      small
                      href={`/operations/staking/broadcast-transaction`}
                      onClick={() => setAppState({ stepCompleted: 3 })}
                    >
                      Proceed to the next step &rarr;
                    </Button>
                  </div>
                </Card>
              </>
            )}
          </>
        </LayoutColumn.Column>

        <Footer />
      </LayoutColumn>

      {/* Non-custodial signing modal (default) */}
      <Modal
        title="Details"
        width="calc(40% - 10px)"
        footer={null}
        open={isModalOpen}
        onCancel={closeModal}
      >
        <p>
          <b>Note</b>: You are currently viewing the page for{" "}
          <b>{custodialSigningPage ? "custodial" : "non-custodial"}</b> signing.
          Use the button &quot;
          <b>
            Click Here to Explore{" "}
            {custodialSigningPage ? "Non-Custodial" : "Custodial"} Signing
          </b>
          &quot; outside of this modal, for further information on the
          respective signing method. This will display a different page for the
          current step.
        </p>
        <br />

        <p>There are several methods available for signing transactions:</p>
        <ul>
          <li>
            If you&apos;re signing and broadcasting transactions with a solution
            outside of the Staking API, refer to the guide{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.figment.io/guides/staking-api/advance-flows-using-transaction-hash"
            >
              Advance Flows using a Transaction Hash
            </Link>
          </li>
          <br />

          <li>
            <b>Non-custodial signing</b>: For more information about decoding
            and signing payloads, refer to the guide{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.figment.io/guides/staking-api/figment-signing-transactions"
            >
              Signing Transactions with Figment&apos;s npm Package
            </Link>
            . The unsigned transaction payload can be found in the response from
            the Staking API after submitting data to a flow. Refer to the{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.figment.io/guides/staking-api/solana/delegate/create-new-stake-account"
            >
              Figment Docs
            </Link>{" "}
            for more information
          </li>
          <br />

          <li>
            <b>Custodial signing</b>: If you&apos;re signing with a custodial
            solution such as the Fireblocks API, refer to the guide{" "}
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
        </ul>
      </Modal>

      {/* Custodial signing modal */}
      <Modal
        title="Details"
        width="calc(40% - 10px)"
        footer={null}
        open={isCustodialSigningModalOpen}
        onCancel={closeCustodialSigningModal}
      >
        <p>
          <b>Note</b>: You are currently viewing the page for{" "}
          <b>{custodialSigningPage ? "custodial" : "non-custodial"}</b> signing.
          Use the button &quot;
          <b>
            Click Here to{" "}
            {custodialSigningPage
              ? "Continue with Non-Custodial"
              : "Explore Custodial"}{" "}
            Signing
          </b>
          &quot; outside of this modal, for further information on the
          respective signing method. This will display a different page for the
          current step.
        </p>
        <br />

        <p>There are several methods available for signing transactions:</p>
        <ul>
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
        </ul>
      </Modal>
    </>
  );
}
