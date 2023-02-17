// @ts-nocheck
import React, { useState } from "react";
import Link from "next/link";
import { Modal } from "antd";
import {
  LoadingOutlined,
  WarningOutlined,
  LinkOutlined,
} from "@ant-design/icons";

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
  trimmedSolanaAccount,
} from "@components/ui-components";

export default function BroadcastTransaction({ operation }) {
  const { appState, setAppState } = useAppState();
  const {
    flowId,
    flowState,
    flowResponse,
    signedTransactionPayload,
    sol_accountPrivateKey,
    sol_fundingAccountPubkey,
    sol_createStakeAccountAmount,
    errorResponse,
    errorResponseTimestamp,
    transitionErrorResponse,
  } = appState;
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const data = {
      type: "stake_account",
      flow_id: flowId,
      action: "sign_stake_account_tx",
      signed_payload: form.signed_payload.value,
      funding_account_pubkey: sol_fundingAccountPubkey,
      amount: sol_createStakeAccountAmount,
      privateKey: sol_accountPrivateKey,
    };

    setIsLoading(true);

    const response = await fetch(`/api/staking/broadcast-account-transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const { success_response, reply, date, submit_result, result, flow_state } =
      await response.json();

    console.log(success_response);
    console.log(flow_state);
    console.log(date);
    console.log(result);
    console.log(submit_result);

    if (success_response) {
      setAppState({
        flowState: success_response?.state,
        flowResponse: success_response,
      });
    }

    setIsLoading(false);

    if (flow_state?.state === "stake_account") {
      alert("Flow state is already stake_account - Proceed to the next step!");
      setAppState({ flowState: state, flowResponse: flow_state });
    }

    if (submit_result?.code === "transition_error") {
      console.log("Transition Error");
    }

    if (result?.code === "invalid") {
      setAppState({ errorResponse: result, errorResponseTimestamp: date });
    }

    if (submit_result?.code === "transition_error") {
      setAppState({
        transitionErrorResponse: submit_result,
        errorResponseTimestamp: date,
      });
    }

    if (result?.code === "transition_error") {
      setAppState({
        transitionErrorResponse: result,
        errorResponseTimestamp: date,
      });
    }

    if (result?.code) {
      alert(`${result.code}: ${result.message}`);
    }

    if (result?.data) {
      setAppState({ flowState: result.state, flowResponse: result });
    }

    if (reply) {
      setAppState({ flowState: reply.state, flowResponse: reply });
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
                    flowState === "stake_account_tx_broadcasting" ||
                    flowState === "delegated"
                  }
                  style={{ width: "auto" }}
                  onClick={() => {
                    setAppState({
                      errorResponse: undefined,
                      transitionErrorResponse: undefined,
                    });
                  }}
                >
                  {isLoading && <LoadingOutlined />} Submit Signed Transaction
                  Payload
                </Button>
              </form>
            </Card>
          )}
        </LayoutColumn.Column>

        <LayoutColumn.Column>
          {errorResponse && (
            <>
              <p className="callout">
                <Formatted block>
                  {JSON.stringify(errorResponse, null, 2)}
                </Formatted>
              </p>
            </>
          )}
          {signedTransactionPayload && flowState && (
            <>
              <Card medium>
                {transitionErrorResponse && (
                  <>
                    <p className="callout">
                      <WarningOutlined /> A transition error has occurred.
                      <Formatted block>
                        {" "}
                        {JSON.stringify(transitionErrorResponse, null, 2)}
                      </Formatted>
                      The action <Formatted>sign_stake_account_tx</Formatted>{" "}
                      cannot be processed when the flow state is{" "}
                      <Formatted>{flowResponse.state}</Formatted>
                    </p>
                  </>
                )}

                <p>
                  Flow ID <Formatted>{flowId}</Formatted> state is{" "}
                  <Formatted>{flowResponse.state}</Formatted>.{" "}
                </p>

                {flowResponse.state === "stake_account" && (
                  <>
                    <p>
                      At this point in the flow, the stake account has either
                      been created or assigned. You can proceed to the next
                      step.
                    </p>
                    <details>
                      <summary>Click to view the full response</summary>
                      <Formatted block maxHeight="510px">
                        {JSON.stringify(flowResponse, null, 2)}
                      </Formatted>
                    </details>
                    <Button
                      style={{ display: "block", margin: "0 auto" }}
                      onClick={() => setAppState({ stepCompleted: 4 })}
                      href={`/operations/staking/flow-state`}
                    >
                      Proceed to the next step &rarr;
                    </Button>
                  </>
                )}

                {flowState === "stake_account_tx_broadcasting" && (
                  <>
                    <p>
                      After the signed payload has been broadcast to the Solana
                      cluster by the Staking API, the flow state changes from{" "}
                      <Formatted>stake_account_tx_signature</Formatted> &rarr;{" "}
                      <Formatted>stake_account_tx_broadcasting</Formatted>.
                    </p>
                    <p>
                      When the transaction is confirmed on-chain, generally
                      within a few seconds, the flow state will update to{" "}
                      <Formatted>stake_account</Formatted>.
                    </p>
                    <p>
                      The newly created Stake Account&apos;s public key (
                      <b>
                        {trimmedSolanaAccount(
                          flowResponse.data.stake_account_pubkey
                        )}
                      </b>
                      ) can be found in the response data.
                    </p>
                    <details>
                      <summary>Click to view the full response</summary>
                      <ul>
                        <li>
                          The <Formatted>wait</Formatted> action during the{" "}
                          <Formatted>stake_account_tx_broadcasting</Formatted>{" "}
                          state provides a timestamp value for{" "}
                          <Formatted>estimated_state_change_at</Formatted>. The
                          state can change to{" "}
                          <Formatted>stake_account</Formatted> at or before this
                          timestamp. If the transaction is taking longer than
                          expected, the Staking API will continue to update the
                          estimated state change timestamp.
                        </li>
                      </ul>

                      <Formatted block maxHeight="600px">
                        {JSON.stringify(flowResponse, null, 2)}
                      </Formatted>
                    </details>
                    <p>
                      At this point in the flow, the action{" "}
                      <Formatted>create_delegate_tx</Formatted> can be used to
                      complete the flow. We&apos;ll get to that in a moment.
                      First, we&apos;ll take a look at how to determine the
                      current state of a flow.
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
            The action at this point of the flow is{" "}
            <Formatted>sign_delegate_tx</Formatted> &mdash; indicating that we
            need to supply the signed transaction payload.
          </li>
          <br />

          <li>
            The action <Formatted>assign_stake_account</Formatted> can be used
            to assign a different stake account, prior to delegation.
          </li>
          <br />

          <li>
            It is also possible to sign and broadcast payloads outside of
            Figment&apos;s Staking API, and complete a Staking API flow by
            providing the transaction hash &mdash; This method is described in
            the{" "}
            <Link
              rel="noopener noreferrer"
              target="_blank"
              href="https://docs.figment.io/guides/staking-api/advance-flows-using-transaction-hash"
            >
              Figment Docs
            </Link>
            .
          </li>
          <br />

          <li>
            It is sometimes useful to get an updated transaction payload, for
            which there is another <Formatted>action</Formatted> named{" "}
            <Formatted>refresh_delegate_tx</Formatted>, which generates a new
            unsigned transaction payload. This can be used for situations where
            a{" "}
            <ToolTip
              title={`The word nonce means "a number, used once". Nonces are used to prevent transactions from being replayed.`}
              style={{ textDecoration: "underline dotted", cursor: "help" }}
            >
              nonce value
            </ToolTip>{" "}
            has increased, or when dealing with <b>Solana</b>, where there is a
            relatively short signing window of around <b>90 seconds</b>
          </li>
          <br />

          <li>
            The flow state will change from{" "}
            <Formatted>delegate_tx_broadcasting</Formatted> to{" "}
            <Formatted>delegation_activating</Formatted> once the transaction is
            confirmed on-chain, and become{" "}
            <Formatted>delegation_active</Formatted> at the next{" "}
            <ToolTip
              style={{ textDecoration: "underline dotted", cursor: "help" }}
              title={`A Solana epoch lasts for approximately 2.5 days. Note that it is possible a delegation will be subjected to a multi-epoch warmup period.`}
            >
              epoch boundary
            </ToolTip>
            .
          </li>
          <br />

          <li>
            The flow state will change from{" "}
            <Formatted>delegate_tx_broadcasting</Formatted> to{" "}
            <Formatted>delegation_activating</Formatted> once the transaction is
            confirmed on-chain
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
        </ul>
      </Modal>
    </>
  );
}
