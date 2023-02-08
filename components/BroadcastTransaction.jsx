// @ts-nocheck
import React, { useState } from "react";
import Link from "next/link";
import { Modal } from "antd";
import { useAppState } from "@utilities/appState";

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

export default function BroadcastTransaction({ operation }) {
  const { appState, setAppState } = useAppState();
  const { flowId, flowState, flowResponse, signedTransactionPayload } =
    appState;

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
      setAppState({ flowState: result.state, flowResponse: result });
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const title = "Broadcast Transaction";

  return (
    <>
      <Head title={title} description={DESCRIPTION} />

      <BreadCrumbs step={4} />
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
          <Card small justify>
            {!signedTransactionPayload && (
              <>
                <p>
                  No signed transaction payload is available to broadcast.
                  Please complete the previous step,{" "}
                  <b>Decode & Sign Payload</b>.
                </p>
                <Button
                  small
                  href="/operations/staking/sign-payload"
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
            {signedTransactionPayload && (
              <>
                <p>
                  Provide the signed <Formatted>transaction_payload</Formatted>{" "}
                  back to the Staking API. The transaction is then broadcast to
                  the network via the Staking APIs dedicated infrastructure.
                </p>
                {/* <p>
              It is also possible to sign and broadcast payloads elsewhere, and
              complete a Staking API flow by providing the transaction hash
              &mdash; This method is described in the Figment Docs.
            </p> */}
                <Button small secondary onClick={() => showModal()}>
                  Click Here For More Information
                </Button>
              </>
            )}
          </Card>
        </LayoutColumn.Column>

        <LayoutColumn.Column style={{ width: "100%", maxWidth: "700px" }}>
          {signedTransactionPayload && (
            <Card medium>
              <form onSubmit={handleSubmit} method="post">
                <h6>&darr; Signed Transaction Payload</h6>
                <textarea
                  className="textArea"
                  id="signed_payload"
                  name="signed_payload"
                  required
                  defaultValue={signedTransactionPayload}
                />
                <br />
                <Button
                  disabled={
                    flowState === "delegate_tx_broadcasting" ||
                    flowState === "delegated"
                  }
                  style={{ width: "auto" }}
                >
                  Submit Signed Transaction Payload
                </Button>
              </form>
            </Card>
          )}
        </LayoutColumn.Column>

        <LayoutColumn.Column>
          {signedTransactionPayload && flowState && (
            <>
              <Card small>
                <p>
                  Flow ID <Formatted>{flowId}</Formatted> state is{" "}
                  <Formatted>{flowResponse.state}</Formatted>.{" "}
                </p>

                {flowResponse.state === "delegate_tx_broadcasting" && (
                  <>
                    <p>
                      After the signed payload has been broadcast to the NEAR
                      network by the Staking API,
                      <br />
                      the flow state changes from{" "}
                      <Formatted>delegate_tx_signature</Formatted> to{" "}
                      <Formatted>delegate_tx_broadcasting</Formatted>.
                      <br />
                      <details>
                        <summary>Click to view the full response</summary>
                        <Formatted block maxHeight="600px">
                          {JSON.stringify(flowResponse, null, 2)}
                        </Formatted>
                      </details>
                      <br />
                      At this point in the flow, the only action remaining is to
                      check the flow state to ensure it is{" "}
                      <Formatted>delegated</Formatted>.
                    </p>
                    <Button
                      style={{ display: "block", margin: "0 auto" }}
                      onClick={() => setAppState({ stepCompleted: 4 })}
                      href={`/operations/${operation}/flow-state`}
                    >
                      Proceed to the next step &rarr;
                    </Button>
                  </>
                )}
              </Card>
            </>
          )}
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
            The <Formatted>action</Formatted> at this point of the flow is{" "}
            <Formatted>sign_delegate_tx</Formatted> &mdash; indicating that we
            need to supply the signed transaction payload.
          </li>
          <br />

          <li>
            It is sometimes useful to get an updated transaction payload, for
            which there is another <Formatted>action</Formatted> named{" "}
            <Formatted>refresh_delegate_tx</Formatted>, which generates a new
            unsigned transaction payload. This can be used for situations where
            a{" "}
            <ToolTip
              placement="top"
              title={`The word nonce means "a number, used once". Nonces are used to prevent transactions from being replayed.`}
              style={{ textDecoration: "underline" }}
            >
              nonce value
            </ToolTip>{" "}
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
            <Formatted>delegate_tx_broadcasting</Formatted> to{" "}
            <Formatted>delegated</Formatted> once the transaction is confirmed
            on-chain
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
