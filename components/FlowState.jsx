// @ts-nocheck
import React, { useState } from "react";
import Link from "next/link";
import { LoadingOutlined, WarningOutlined } from "@ant-design/icons";

import {
  DESCRIPTION,
  Head,
  Title,
  BreadCrumbs,
  Button,
  Card,
  Formatted,
  Footer,
  LayoutVertical,
  ToolTip,
} from "@components/ui-components";

import { useAppState } from "@utilities/appState";

export default function FlowState({ operation }) {
  const { appState, setAppState } = useAppState();
  const [isLoading, setIsLoading] = useState(false);

  const { flowId, responseData, flowState, flowResponse } = appState;

  const handleGetState = async () => {
    const data = {
      flow_id: flowId,
    };

    setIsLoading(true);
    const response = await fetch(`/api/${operation}/get-flow-state`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    setAppState({
      flowState: result.state,
      responseData: result,
      flowResponse: result,
    });
    setIsLoading(false);
  };

  const title = "Get Flow State";

  return (
    <>
      <Head title={title} description={DESCRIPTION} />

      <BreadCrumbs step={5} />
      <LayoutVertical>
        <Title>Get Flow State</Title>

        <Card small>
          {!flowState && (
            <>
              <p style={{ textAlign: "center" }}>
                Please refresh the flow state &darr;
              </p>
            </>
          )}

          {flowState === "delegation_activating" && (
            <>
              <p>
                The flow <Formatted>{flowId}</Formatted>&apos;s state is{" "}
                <Formatted>{flowState}</Formatted>, indicating that the Staking
                API has broadcast the delegate transaction, and the delegation
                will become active after the activation period.
              </p>
              <p>
                You can proceed to the final step, <b>View All Flows</b>.
              </p>
            </>
          )}

          {flowState === "delegate_tx_signature" && (
            <>
              <p>
                The flow <Formatted>{flowId}</Formatted>&apos;s state is{" "}
                <Formatted>{flowState}</Formatted>, indicating that the Staking
                API now expects you to create a delegate transaction to complete
                the flow.
                <br />
                <br />
              </p>
            </>
          )}

          {flowState === "stake_account" && (
            <>
              <p>
                The flow <Formatted>{flowId}</Formatted>&apos;s state is{" "}
                <Formatted>{flowState}</Formatted>, indicating that the Staking
                API now expects you to create a delegate transaction to complete
                the flow.
                <br />
                <br />
                For Solana, the <Formatted>create_delegate_tx</Formatted> action
                has a single input: a Validator address.
                <br />
                On Devnet, it is possible to use any Vote Account Address and we
                will supply a default value in the next step. <br />
                <br />
                Since we just created and assigned a stake account and are now
                ready to delegate our SOL, we will continue with the action{" "}
                <Formatted>create_delegate_tx</Formatted>.
                <br />
                <br />
                <Button href="/operations/staking/delegate">
                  Proceed to the next step &rarr;
                </Button>
              </p>
            </>
          )}

          {flowState === "initialized" && (
            <>
              <p>
                <WarningOutlined /> The flow state is{" "}
                <Formatted>{flowState}</Formatted>. This indicates that previous
                steps are incomplete. Please complete the steps{" "}
                <b>Submit Data</b>, <b>Decode & Sign Payload</b> and{" "}
                <b>Broadcast Transaction</b> first.
              </p>
              <Button
                small
                href="/operations/staking/broadcast-transaction"
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

          {flowState === "stake_account_tx_broadcasting" && (
            <>
              <p>
                Once the signed transaction has been broadcast by the Staking
                API, it will take a moment to be confirmed on the network. Check
                the final state of the flow with a GET request to the{" "}
                <ToolTip
                  style={{ textDecoration: "underline dotted", cursor: "help" }}
                  placement="bottom"
                  title={`/api/v1/flows/<flow_id> - Refer to the Figment Docs for more information regarding endpoints.`}
                >
                  Staking API endpoint
                </ToolTip>{" "}
                , specifying the flow ID you want to query.
              </p>
              <p>
                For example: GET <Formatted>/api/v1/flows/{flowId}</Formatted>
              </p>
            </>
          )}

          {/* {flowState === "delegated" && (
            <>
              <p>
                Congratulations! Flow{" "}
                <Formatted>{flowId.toString().slice(0, -27)}</Formatted>
                &apos;s state is now <Formatted>{flowState}</Formatted>.<br />
                <br />
                The transaction status is{" "}
                <Formatted>
                  {responseData.data.delegate_transaction.status}
                </Formatted>{" "}
                and the staking flow is complete! If you&apos;re interested, you
                can{" "}
                <ToolTip
                  placement="top"
                  title={`Click here to view the transaction details in a new tab.`}
                >
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://explorer.testnet.near.org/transactions/${responseData?.data.delegate_transaction.hash}`}
                  >
                    view the transaction
                  </Link>
                </ToolTip>{" "}
                on the NEAR Block Explorer.
                <br />
                <br />
                In the final step, we will examine how to view all of the flows
                that you have created.
              </p>
            </>
          )} */}

          {flowState === "stake_account_tx_signature" && (
            <>
              <p>
                <WarningOutlined /> The flow state is
                <Formatted>{flowState}</Formatted>. This indicates that previous
                steps are incomplete. Please complete the steps{" "}
                <b>Submit Data</b> and <b>Decode & Sign Payload</b> first.
              </p>
              <Button
                small
                href="/operations/staking/submit-data"
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
        </Card>

        <Button disabled={isLoading} onClick={() => handleGetState()}>
          {isLoading && <LoadingOutlined />} Get Current Flow State
        </Button>
        <br />

        {responseData &&
          (flowState === "delegate_tx_broadcasting" ||
            flowState === "delegated" ||
            flowState === "stake_account_tx_broadcasting" ||
            flowState === "stake_account" ||
            flowState === "delegation_activating") && (
            <Card
              small
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "stretch",
              }}
            >
              <h6>&darr; Staking API Response</h6>
              <Formatted block maxHeight="360px">
                {JSON.stringify(responseData, null, 2)}
              </Formatted>
            </Card>
          )}

        {flowState === "delegated" && (
          <Button
            onClick={() => setAppState({ ...appState, stepCompleted: 5 })}
            href="/view-all-flows"
          >
            Proceed to the final step &rarr;
          </Button>
        )}

        <Footer />
      </LayoutVertical>
    </>
  );
}
