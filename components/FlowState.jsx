// @ts-nocheck
import Link from "next/link";
import React, { useState } from "react";
import { Row, Col } from "antd";
import { SolutionOutlined, CheckCircleOutlined } from "@ant-design/icons";
import styles from "@styles/Home.module.css";
import { useAppState } from "@utilities/appState";

import ToolTip from "@components/elements/ToolTip";
import Description from "@components/elements/Description";

import {
  Title,
  BreadCrumbs,
  Button,
  Card,
  Formatted,
  Footer,
} from "@pages/ui-components";

export default function FlowState({ operation }) {
  const { appState, setAppState } = useAppState();
  const [isLoading, setIsLoading] = useState(false);

  const { flowId, responseData, flowState } = appState;

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
    setAppState({ flowState: result.state, responseData: result });
    setIsLoading(false);
  };

  return (
    <>
      <BreadCrumbs step={5} />
      <Title>Get Flow State</Title>

      <Card>
        {flowState === "delegate_tx_broadcasting" && (
          <p>
            <p>
              Once the signed transaction has been broadcast by the Staking API,
              it will take a moment to be confirmed on the network. Check the
              final state of the flow with a GET request to the{" "}
              <ToolTip
                placement="right"
                title={`/api/v1/flows/${flowId} - Refer to the Figment Docs for more information.`}
              >
                Staking API endpoint
              </ToolTip>{" "}
              , specifying the flow ID you want to query.
            </p>
            <p>
              For example: GET <Formatted>/api/v1/flows/{flowId}</Formatted>
            </p>
          </p>
        )}
        {flowState === "delegated" && (
          <>
            <p>
              Congratulations! Flow {flowId.toString().slice(0, -27)}
              &apos;s state is <Formatted>{flowState}</Formatted>, the
              transaction status is{" "}
              <Formatted>
                {responseData.data.delegate_transaction.status}
              </Formatted>{" "}
              and the staking flow is complete!
              <br />
              <br />
              If you&apos;re interested, you can{" "}
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
        )}
      </Card>

      <Row justify="space-around" className={styles.paddingBottom}>
        <Col span={10}>
          {flowState !== "delegated" && (
            <Button onClick={() => handleGetState()}>
              Get Current Flow State
            </Button>
          )}
          {flowState === "delegated" && (
            <Button
              onClick={() => setAppState({ ...appState, stepCompleted: 5 })}
              href="/view-all-flows"
            >
              Proceed to the final step &rarr;
            </Button>
          )}

          {isLoading ? (
            "Loading..."
          ) : (
            <>
              {responseData && flowState === "delegate_tx_broadcasting" && (
                <>
                  <h3>&darr; Staking API Response</h3>
                  <Formatted block maxHeight="500px">
                    {JSON.stringify(responseData, null, 2)}
                  </Formatted>
                </>
              )}
              {responseData && flowState === "delegated" && (
                <>
                  <h6>&darr; Staking API Response</h6>
                  <Formatted block maxHeight="500px">
                    {JSON.stringify(responseData, null, 2)}
                  </Formatted>
                </>
              )}
            </>
          )}
        </Col>
      </Row>

      <Footer />
    </>
  );
}
