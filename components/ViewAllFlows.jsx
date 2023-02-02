// @ts-nocheck
import React from "react";
import Link from "next/link";
import { useState } from "react";
import styles from "@styles/Home.module.css";
import { Row, Col, Modal, Pagination } from "antd";
import { useAppState } from "@utilities/appState";

import ToolTip from "@components/elements/ToolTip";

import {
  Title,
  BreadCrumbs,
  Button,
  Card,
  Formatted,
  Footer,
  Layout,
} from "@pages/ui-components";

export default function ViewAllFlows() {
  const { appState, setAppState } = useAppState();
  const { flowId, responseData, pageItem } = appState;

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
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
    document.getElementById("page").value = "1";
  };

  const handlePaginationChange = async (page) => {
    // responseData.data[0] through responseData.data[19] are valid
    // but the Pagination component's page parameter starts at 1,
    // so we need to subtract one to get the correct index.
    setAppState({ pageItem: responseData?.data[page - 1] });
  };

  const codeSnippet = `{responseData?.data && (
  Object?.keys(responseData.data).map((index) => (<>
    {responseData?.data[index].state === 'delegated' && (
      <pre key={responseData?.data[index]}>
        {JSON.stringify(responseData?.data[index].id, null, 2) + JSON.stringify(responseData?.data[index].state, null, 2)}
      </pre>
    )}
  </>))
)}`;

  return (
    <>
      <BreadCrumbs step={6} />
      <Layout>
        <Title>View All Flows</Title>
        <Card small>
          <p>
            As you create new flows, their current state and response data can
            be viewed at any time in a paginated format. This works differently
            from querying details of a specific flow using its{" "}
            <Formatted>flowId</Formatted> as illustrated in the previous step.
            <br />
            <br />
            To view all flows created by your account, send a GET request to the{" "}
            <ToolTip
              placement="bottom"
              title={`/api/v1/flows - Refer to the Figment Docs for more information.`}
              arrowPointAtCenter
              className={styles.tooltip}
            >
              Staking API endpoint
            </ToolTip>{" "}
            without specifying a <Formatted>flowId</Formatted>. Select a page
            number, then click <b>Get Page of Flows</b> to continue.
            <form method="post" onSubmit={handleSubmit}>
              <label htmlFor="page" className={styles.centerLabel}>
                Select Page Number
              </label>
              <input
                type="number"
                id="page"
                name="page"
                defaultValue="1"
                min="1"
                className={styles.pageNumberInput}
              />
              <Button
                style={{ marginTop: "10px" }}
                onClick={() => {
                  setAppState({ flowCompleted: true });
                }}
              >
                Get Page of Flows
              </Button>
              {responseData?.page && (
                <>
                  <Button
                    destructive
                    type="text"
                    htmlType="button"
                    onClick={handleReset}
                  >
                    Reset Page
                  </Button>
                </>
              )}
            </form>
            <br />
            When you are done here you can{" "}
            <Link href="/">return to the main page</Link>, or stop the Next.js
            server and close this browser tab to close the app.{" "}
            <b>
              Thank you for taking the time to visualize Figment&apos;s Staking
              API!
            </b>
          </p>
          <Button size="large" type="text" onClick={() => showModal()}>
            Click Here For More Information
          </Button>
        </Card>

        {responseData && !responseData.page && !isLoading && (
          <Card small>
            <h6>&darr; Recently completed flow</h6>
            <Formatted block maxHeight="500px">
              {JSON.stringify(responseData, null, 2)}
            </Formatted>
          </Card>
        )}

        {isLoading && <p>Loading...</p>}

        {responseData?.page && !isLoading && (
          <Card medium>
            <p>
              In this response from the Staking API, the{" "}
              <Formatted>data[]</Formatted> array contains{" "}
              <b>{responseData?.data.length}</b> results per page &mdash;
              <br />
              You are curently viewing page <b>{responseData?.page}</b> of{" "}
              <b>{responseData?.pages}</b>. Use the pagination control below to
              move between results.
            </p>
            <Pagination
              total={responseData?.data?.length ? responseData.data.length : 1}
              pageSize={1}
              responsive={true}
              defaultCurrent={1}
              onChange={handlePaginationChange}
            />
            <Formatted block maxHeight="450px">
              {JSON.stringify(pageItem, null, 2)}
            </Formatted>
          </Card>
        )}

        <Footer />
      </Layout>

      <Modal
        title="Details"
        width="calc(40% - 15px)"
        footer={null}
        open={isModalOpen}
        onCancel={closeModal}
      >
        <ul>
          <li>
            <b>Note</b>: The first time you visit this page, it will display the
            most recent flow that you have completed by default.
          </li>
          <br />

          <li>
            When you have created multiple flows, their state and all current
            information about them can be viewed by passing the query parameter:{" "}
            <Formatted>?page=</Formatted>. For example:{" "}
            <Formatted>api/v1/flows?page=2</Formatted>.
            <br />
          </li>
          <br />

          <li>
            If you&apos;re expecting to see only one flow here because you only
            created one flow while using the app, remember that the flows are
            linked to your Figment account &mdash; <i>not</i> the API key
            you&apos;re using. It is possible that the API key you supplied in
            the <Formatted>.env</Formatted> file is from a Figment account which
            has already created multiple flows. If that is the case, you will
            see more than one result on this page.
          </li>
          <br />

          <li>
            Flow responses viewed in this way are paginated and returned in a{" "}
            <Formatted>data</Formatted> array. Each object in the{" "}
            <Formatted>data</Formatted> array is the most recent response for
            that <Formatted>flowId</Formatted>.
          </li>
          <br />

          <li>
            Pagination is currently{" "}
            <Formatted>responseData.data.length</Formatted> &rarr;{" "}
            <b>
              {responseData?.data?.length ? responseData?.data?.length : "?"}
            </b>{" "}
            flows per page (to a max of 20).
            <br />
            Access individual results (in this context) with{" "}
            <Formatted>responseData.data[0]</Formatted> through{" "}
            <Formatted>responseData.data[19]</Formatted>.
          </li>

          <li>
            Developers can <Formatted>map()</Formatted> to filter a page of
            flows by their state (for example, <Formatted>delegated</Formatted>
            ):
            <br />
            <details>
              <summary>Click here to expand code snippet</summary>
              <Formatted block>{codeSnippet}</Formatted>

              <p>
                &nbsp;Based on the current page being viewed, such a filter
                returns any <Formatted>delegated</Formatted> flows:
              </p>

              <Formatted block>
                {responseData?.data && responseData?.data.length > 1
                  ? Object?.keys(responseData.data).map((index) => (
                      <>
                        {responseData?.data[index].state === "delegated" && (
                          <Formatted block key={responseData?.data[index]}>
                            {responseData?.data[index].id.toString() +
                              " " +
                              responseData?.data[index].state.toString()}
                          </Formatted>
                        )}
                      </>
                    ))
                  : "Select a page of results first - input a number and click Get Page of Flows"}
              </Formatted>

              <p>
                &nbsp;Or filter by{" "}
                <Formatted>
                  responseData?.data[index].state === &apos;initialized&apos;
                </Formatted>
                :
              </p>
              <Formatted block>
                {responseData?.data && responseData?.data.length > 1
                  ? Object?.keys(responseData.data).map((index) => (
                      <>
                        {responseData?.data[index].state === "initialized" && (
                          <Formatted block key={responseData?.data[index]}>
                            {responseData?.data[index].id.toString() +
                              " " +
                              responseData?.data[index].state.toString()}
                          </Formatted>
                        )}
                      </>
                    ))
                  : "Select a page of results first - input a number and click Get Page of Flows"}
              </Formatted>
            </details>
          </li>
          <br />

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
          <br />
        </ul>
      </Modal>
    </>
  );
}
