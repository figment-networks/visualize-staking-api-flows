// @ts-nocheck
import React from "react";
import Link from "next/link";
import { useState } from "react";
import styles from "@styles/Home.module.css";
import { Button, Modal, ConfigProvider } from "antd";

import { useAppState } from "@utilities/appState";

export default function ViewAllFlows() {
  const { appState, setAppState, clearAppState } = useAppState();

  // Destructure state variables
  const { flowId, flowResponse, responseData, flowState } = appState;

  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;

    const data = {
      flow_id: flowId,
      page: form.page.value,
    };

    setIsLoading(true);
    const response = await fetch(`/api/get-flows`, {
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

  const handleReset = async (event) => {
    setAppState({ responseData: undefined });
    setIsLoading(false);
  };

  const codeSnippet = `{responseData?.data
  ? (
    Object?.keys(responseData.data).map((index) => (<>
        {responseData?.data[index].state === 'delegated' 
        ? (
        <pre className="responseFixed" key={responseData?.data[index]}>
        {JSON.stringify(responseData?.data[index].id, null, 2) + JSON.stringify(responseData?.data[index].state, null, 2)}
        </pre>
        ) 
        : "" }
      
    </>))
  ) : ""}`;

  return (
    <div className="container">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#034d77",
            colorError: "#C90000",
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
            <li>
              <b>Note</b>: When this page loads, it will display the most recent
              flow that you have completed by default.
            </li>
            <li>
              If you have created multiple flows, their state and all current
              information about them can be viewed by pages.
            </li>
            <li>
              Flow responses viewed in this way are paginated and returned in a{" "}
              <code>data</code> array.
            </li>
            <li>
              Each object in the <code>data</code> array is the most recent response for that flowId.
            </li>
            <li>
              Pagination is currently fixed to <code>responseData.data.length</code> &rarr; <b>20</b> flows per page.<br />
              Access individual results (in this context) with <code>responseData.data[0]</code>{" "}
              through <code>responseData.data[19]</code>. 
            </li>
            <li>
              Use <code>.map()</code> to filter a page of flows by their state (for example, <code>delegated</code>):
              <br />
              <details>
                <summary>Click here to expand code snippet</summary>
                <pre className="detailcode">{codeSnippet}</pre>
        
                <p>&nbsp;Based on the current page being viewed, such a filter returns any <code>delegated</code> flows:</p>

                <pre className="detailcode">
                {responseData?.data && responseData?.data.length > 1
                ? (
                  Object?.keys(responseData.data).map((index) => (<>
                     {responseData?.data[index].state === 'delegated'
                     ? (
                      <pre className="responseFixed" key={responseData?.data[index]}>
                      {responseData?.data[index].id.toString() + ' ' + responseData?.data[index].state.toString()}
                      </pre>
                      ) 
                     : "" }
                  </>))
                ) : "Select a page of results - input a number and click Get Page of Flows"}
                </pre>

                <p>&nbsp;Or filter by <code>responseData?.data[index].state === &apos;initialized&apos;</code>:</p>

                <pre className="detailcode">
                {responseData?.data && responseData?.data.length > 1
                ? (
                  Object?.keys(responseData.data).map((index) => (<>
                     {responseData?.data[index].state === 'initialized' 
                     ? (
                      <pre className="responseFixed" key={responseData?.data[index]}>
                      {responseData?.data[index].id.toString() + ' ' + responseData?.data[index].state.toString()}
                      </pre>
                      ) 
                     : "" }
                  </>))
                ) : "Select a page of results - input a number and click Get Page of Flows"}

                </pre>
              </details>
            </li>
            <li>
              Check the Figment{" "}
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://docs.figment.io/api-reference/staking-api/near#get%20flow%20status"
              >
                API Reference
              </Link>{" "}
              for details.
            </li>
          </ul>
        </Modal>

        <div id="top">
          <h1 className={styles.title}>View All Flows</h1>
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
          To check the state of all flows that were created using your API key,
          send a GET request to the <code>api/v1/flows</code> endpoint without
          specifying a flowId. <br /><br />
          Data from this query is paginated in groups of 20, with page 1 being displayed by default.
          If they exist, additional pages can be accessed<br /> via the query
          parameter <code>?page=</code>.
          For example: <code>api/v1/flows?page=2</code>.<br />
          <br />
          <p align="center">
            <Link href="/">Return to the Main Page</Link>
          </p>
        </p>
        </div>

        <form method="post" onSubmit={handleSubmit}>
          <label htmlFor="page">Select Page</label>
          <input type="number" id="page" name="page" defaultValue="1" min="1" />
          <Button type="primary" htmlType="submit">
            Get Page of Flows
          </Button>
          <br />
          <Button danger type="primary" htmlType="button" onClick={handleReset}>
            Reset
          </Button>
        </form>

        <br />
        {isLoading ? "Loading..." : ""}

        {responseData && !responseData.page && !isLoading ? (
          <>
            <p>
              Recent flow: <b>{flowId}</b>
            </p>
            <pre className="response">
              {JSON.stringify(responseData, null, 2)}
            </pre>
            <br />
          </>
        ) : (
          ""
        )}

        {responseData?.page && !isLoading ? (
          <>
            <p>
              <b>{responseData?.data.length}</b> results per page &mdash; Viewing page{" "}
              <b>{responseData?.page}</b> of <b>{responseData?.pages}</b>
            </p>
            <pre className="responseFixedAllFlows" style={{width: "800px"}}>
              {JSON.stringify(responseData, null, 2)}
            </pre>
            <br />
          </>
        ) : (
          ""
        )}
      </ConfigProvider>
    </div>
  );
}
