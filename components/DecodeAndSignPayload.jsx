// @ts-nocheck
import React from "react";
import Link from "next/link";
import { useState } from "react";
import styles from "/styles/Home.module.css";
import { Button, Modal, ConfigProvider } from "antd";

import { useAppState } from "@utilities/appState";

export default function DecodeAndSignPayload({ operation }) {

  const { appState, setAppState } = useAppState();

  // Destructure state variables
  const {
    flowId,
    flowResponse,
    flowState,
    flowActions,
    flowInputs,
    flowLabels,
    responseData,
    unsignedTransactionPayload,
    decodedTransactionPayload,
    signedTransactionPayload,
    accountAddress,
    accountPublicKey,
    accountPrivateKey,
    validatorAddress,
    delegateAmount,
  } = appState;

  const [formData, setFormData] = useState();

  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDecode = async (event) => {
    event.preventDefault();

    const form = event.target;

    // The @figmentio/slate package defines a decode method which takes
    // the following parameters (except flowId):
    const data = {
      transaction_payload: form.transaction_payload.value,
      network: "near",
      operation: "staking",
      version: "v1",
      transaction_name: "delegateTransaction",
      flow_id: flowId,
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

    console.log(result);
    setAppState({ decodedTransactionPayload: result });
    setFormData(data);
    setIsLoading(false);
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
            <br />
            <li>
              For more information, refer to the guide {" "}
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://docs.figment.io/guides/staking-api/figment-signing-transactions"
              >
                Signing Transactions with Figment&apos;s npm Package
              </Link>
            </li>
            <br/>
            <li>
              If you&apos;re signing with a custodial solution such as
              Fireblocks, read{" "}
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
              The unsigned transaction payload can be found in the response from the Staking API after submitting data to a flow. Learn more in the <Link target="_blank" rel="noopener noreferrer" href="https://docs.figment.io/guides/staking-api/near/delegate/submit-delegate-data">Figment Docs</Link>
            </li>

            <br />

            <li>
              For any network, the payload can be signed by applying the correct signing algorithm and a valid private key. This can be accomplished by using the Figment npm package <b>@figmentio/slate</b>, or hand-rolling a solution using a library intended for a specific network (ex. Solana&apos;s web3.js, Avalanche.js, Polkadot.js, etc.)
            </li>
            <br />
            <li>
              When the signature is applied to the payload, it can then be returned to the Staking API in its signed state. This allows the Staking API to submit the signed payload to the blockchain and complete the flow. 
            </li>
          </ul>
        </Modal>

        <div className="row">
          <h1 className={styles.title}>Decode & Sign Transaction Payloads</h1>
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
            After submitting the delegation data, provide the unsigned{" "}
            <code>transaction_payload</code> below.
            <br />
            <br />
            We can decode it using <code>@figmentio/slate</code> to confirm the
            transaction details.
            <br />
            <br />
            The Staking API will broadcast the transaction to the network.
          </p>
        </div>

        <div className="row">
          <div className="column">

            <form onSubmit={handleDecode} method="post">
              <label htmlFor="transaction_payload">
                Unsigned Transaction Payload
              </label>
              <textarea
                id="transaction_payload"
                name="transaction_payload"
                rows={15}
                cols={80}
                required
                defaultValue={unsignedTransactionPayload}
              />
              <br />

              <Button
                style={{ width: "auto", marginTop: "20px" }}
                type="primary"
                htmlType="submit"
              >
                Decode Transaction Payload with @figmentio/slate
              </Button>
            </form>
          </div>

          <div className="column">
            {isLoading ? <p>Loading...</p> : ""}

            {decodedTransactionPayload && !isLoading ? (
              <>
              <p align="left">
              {" "}
              Current Flow ID: <b>{flowId}</b> <br />
              Flow State: <b>{flowState}</b>
              <br />
              Delegator Address: <b>{accountAddress}</b>
              <br />
              Delegator Public Key: <b>{accountPublicKey}</b>
              <br />
              Validator Address: <b>{validatorAddress}</b>
              <br />
              Amount: <b>{delegateAmount}</b>
            </p>
                <p>Decoded Transaction Payload</p>
                <pre className="payload">
                  {JSON.stringify(decodedTransactionPayload, null, 2)}
                </pre>
                {/* Clicking this button will attempt to sign the transaction payload
                 using the private key of the keypair generated by this application. */}
                <Button
                  style={{ width: "auto" }}
                  type="primary"
                  onClick={handleSignature}
                >
                  Sign Transaction Payload
                </Button>
              </>
            ) : (
              ""
            )}

            {signedTransactionPayload ? (<>
              <p> Signed Transaction Payload </p>
              <br />

              <div
                className="payload"
                onClick={() =>
                  navigator.clipboard.writeText(signedTransactionPayload)
                }
              >
                {signedTransactionPayload}
              </div>
              </>) : (
              ""
            )}

            {signedTransactionPayload ? (
              <>
                <br />
                <br />
                <Button
                  style={{ width: "auto" }}
                  type="primary"
                  htmlType="button"
                  href={`/operations/${operation}/broadcast-transaction`}
                >
                  Proceed to the next step &rarr;
                </Button>
              </>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="footer">
          <br />
          <br />
          <Link href="/">Return to Main Page</Link>
          <br />
          <br />
        </div>
        </ConfigProvider>
      </div>
    </>
  );
}
