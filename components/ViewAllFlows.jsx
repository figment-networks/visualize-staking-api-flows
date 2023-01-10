// @ts-nocheck
import React from "react";
import Link from "next/link";
import { useState } from "react";
import styles from "@styles/Home.module.css";
import { Row, Col, Button, Modal, ConfigProvider, Steps } from "antd";
import {
  WarningOutlined,
  SolutionOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

import { useAppState } from "@utilities/appState";

import Footer from "@components/Footer";

export default function ViewAllFlows() {
  const { appState, setAppState } = useAppState();
  const { flowId, responseData, flowState } = appState;

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

  const codeSnippet = `{responseData?.data && (
  Object?.keys(responseData.data).map((index) => (<>
    {responseData?.data[index].state === 'delegated' && (
      <pre className="responseFixed" key={responseData?.data[index]}>
        {JSON.stringify(responseData?.data[index].id, null, 2) + JSON.stringify(responseData?.data[index].state, null, 2)}
      </pre>
    )}
  </>))
)}`;

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#0D858B",
            colorError: "#C90000",
          },
        }}
      >
        <Row justify="space-around">
          <Col span={24}>
            <div className={styles.header}>
              <Steps
                current={6}
                status="finish"
                className={(styles.description, styles.progress)}
                type="navigation"
                items={[
                  {
                    title: "Create Account",
                    status: "finish",
                    icon: <CheckCircleOutlined />,
                  },
                  {
                    title: "Create a Flow",
                    status: "finish",
                    icon: <CheckCircleOutlined />,
                  },
                  {
                    title: "Submit Data",
                    status: "finish",
                    icon: <CheckCircleOutlined />,
                  },
                  {
                    title: "Decode & Sign Payload",
                    status: "finish",
                    icon: <CheckCircleOutlined />,
                  },
                  {
                    title: "Broadcast Transaction",
                    status: "finish",
                    icon: <CheckCircleOutlined />,
                  },
                  {
                    title: "Get Flow State",
                    status: "finish",
                    icon: <CheckCircleOutlined />,
                  },
                  {
                    title: "View All Flows",
                    status: "process",
                    icon: <SolutionOutlined />,
                  },
                ]}
              />
            </div>
          </Col>
        </Row>

        <h1 className={styles.title}>View All Flows</h1>

        <Row justify="space-around">
          <Col span={10}></Col>
        </Row>

        <Row justify="space-around">
          <Col span={10}>
            <p className={styles.description}>
              Once a flow is created, its current state and response data can be
              viewed at any time. When dealing with multiple flows, they can be
              viewed in a paginated format. This is different from querying
              details of a specific flow using its <code>flowId</code>.
              <br />
              <br />
              Select a page number, then click <b>Get Page of Flows</b> to
              continue.
              <br />
              <br />
              <Button
                size="large"
                className={styles.modalButton}
                type="primary"
                onClick={() => showModal()}
              >
                Click Here For More Information
              </Button>
            </p>
          </Col>
        </Row>

        <Row justify="space-between" className={styles.paddingBottom}>
          <Col span={2}>
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
                type="primary"
                htmlType="submit"
                className={styles.submitButton}
                onClick={() => {
                  setAppState({ flowCompleted: true });
                }}
              >
                Get Page of Flows
              </Button>
              <br />
              {responseData?.page && (
                <>
                  <Button
                    type="text"
                    htmlType="button"
                    className={styles.submitButton}
                    icon={<WarningOutlined />}
                    onClick={handleReset}
                  >
                    Reset Page
                  </Button>
                </>
              )}
            </form>
          </Col>

          <Col span={10}>
            {responseData && !responseData.page && !isLoading && (
              <>
                <h3>&darr; Recently completed flow</h3>
                <pre className={styles.stateResponseViewAll}>
                  {JSON.stringify(responseData, null, 2)}
                </pre>
                <br />
              </>
            )}

            {isLoading && <p>Loading...</p>}

            {responseData?.page && !isLoading && (
              <>
                <p>
                  <code>data[]</code> contains{" "}
                  <b>{responseData?.data.length}</b> results per page &mdash;
                  Viewing page <b>{responseData?.page}</b> of{" "}
                  <b>{responseData?.pages}</b>
                </p>
                <pre
                  className={styles.stateResponseViewAll}
                  style={{ height: "550px" }}
                >
                  {JSON.stringify(responseData, null, 2)}
                </pre>
                <br />
              </>
            )}
          </Col>
          <Col span={2} />
        </Row>

        <br />

        <Footer />

        <Modal
          title="Details"
          width="calc(40% - 15px)"
          footer={null}
          open={isModalOpen}
          onCancel={closeModal}
        >
          <ul>
            <li>
              <b>Note</b>: This page will display the most recent flow that you
              have completed by default.
            </li>
            <br />
            <li>
              To check the state of all flows created by your account, send a
              GET request to the Staking API endpoint without specifying a{" "}
              <code>flowId</code>.
            </li>
            <br />

            <li>
              When you have created multiple flows, their state and all current
              information about them can be viewed by passing the query
              parameter: <code>?page=</code>. For example:{" "}
              <code>api/v1/flows?page=2</code>.<br />
            </li>
            <br />

            <li>
              Flow responses viewed in this way are paginated and returned in a{" "}
              <code>data</code> array. Each object in the <code>data</code>{" "}
              array is the most recent response for that <code>flowId</code>.
            </li>
            <br />

            <li>
              Pagination is currently fixed to{" "}
              <code>responseData.data.length</code> &rarr; <b>20</b> flows per
              page.
              <br />
              Access individual results (in this context) with{" "}
              <code>responseData.data[0]</code> through{" "}
              <code>responseData.data[19]</code>.
            </li>
            <br />

            <li>
              Developers can <code>map()</code> to filter a page of flows by
              their state (for example, <code>delegated</code>):
              <br />
              <details>
                <summary>Click here to expand code snippet</summary>
                <pre className={styles.codeDetail}>{codeSnippet}</pre>

                <p>
                  &nbsp;Based on the current page being viewed, such a filter
                  returns any <code>delegated</code> flows:
                </p>

                <pre className={styles.codeDetail}>
                  {responseData?.data && responseData?.data.length > 1
                    ? Object?.keys(responseData.data).map((index) => (
                        <>
                          {responseData?.data[index].state === "delegated" && (
                            <pre
                              className={styles.codeDetail}
                              key={responseData?.data[index]}
                            >
                              {responseData?.data[index].id.toString() +
                                " " +
                                responseData?.data[index].state.toString()}
                            </pre>
                          )}
                        </>
                      ))
                    : "Select a page of results first - input a number and click Get Page of Flows"}
                </pre>

                <p>
                  &nbsp;Or filter by{" "}
                  <code>
                    responseData?.data[index].state === &apos;initialized&apos;
                  </code>
                  :
                </p>
                <pre className={styles.codeDetail}>
                  {responseData?.data && responseData?.data.length > 1
                    ? Object?.keys(responseData.data).map((index) => (
                        <>
                          {responseData?.data[index].state ===
                            "initialized" && (
                            <pre
                              className={styles.codeDetail}
                              key={responseData?.data[index]}
                            >
                              {responseData?.data[index].id.toString() +
                                " " +
                                responseData?.data[index].state.toString()}
                            </pre>
                          )}
                        </>
                      ))
                    : "Select a page of results first - input a number and click Get Page of Flows"}
                </pre>
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
            <li>
              When you are done here you can return to the main page, or stop
              the Next.js server and close this browser tab to close the app.{" "}
              <br />
              <br />
              <b>
                Thank you for taking the time to visualize Staking API flows!
              </b>
            </li>
          </ul>
        </Modal>
      </ConfigProvider>
    </>
  );
}
