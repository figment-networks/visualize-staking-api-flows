import Link from "next/link";
import { FormEvent, useState, useEffect } from "react";
import styles from "/styles/Home.module.css";
import { Button, Modal } from "antd";

import { useAppState } from "../utilities/appState";

export default function ViewAllFlows() {
  const { appState, setAppState, clearAppState } = useAppState();

  // Destructure state variables
  const {
    flowId,
    flowResponse,
    responseData,
    flowState,
    flowActions,
    flowInputs,
  } = appState;

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState();

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

    // @ts-ignore
    setAppState({ flowState: result.state, responseData: result });
    setIsLoading(false);
  };

  const handleReset = async (event) => {
    // @ts-ignore
    setAppState({ responseData: undefined });
    setIsLoading(false);
  };

  const codeSnippet = `
  {Object.keys(responseData.data).map((index: any) => (
    <>
      <pre className="responseFixed" key={responseData.data[index]}>{JSON.stringify(responseData.data[index])}</pre>
    </>)
  )}`;

  return (
    <div className="container">
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
            Access individual results with <code>responseData.data[0]</code> to{" "}
            <code>responseData.data[19]</code>
          </li>
          <li>
            Try using <code>.map()</code> to filter flows by their state.
            <br />
            <details>
              <summary>Click here to expand code snippet</summary>
              <pre className="detailcode">{codeSnippet}</pre>
            </details>
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

      <p className={styles.description}>
        Get complete information on all flows that you have created by{" "}
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="https://docs.figment.io/api-reference/staking-api/near#get%20flow%20status"
        >
          sending a GET request to the <code>api/v1/flows</code> endpoint.
        </Link>
        <br />
        <br />
        Congratulations, you&apos;ve completed the walkthrough!{" "}
        <Link href="/">Return to the Main Page</Link>
      </p>

      <form method="post" onSubmit={handleSubmit}>
        <label htmlFor="page">Select Page</label>
        <input type="number" id="page" name="page" defaultValue="1" min="1" />
        <Button type="primary" htmlType="submit">
          Get Flows
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
          <p>Recent flow:</p>
          <pre className="response">
            {JSON.stringify(responseData, null, 2)}
          </pre>
          <br />
        </>
      ) : (
        ""
      )}

      {responseData.page && !isLoading ? (
        <>
          <p>
            {responseData?.data.length} results per page. &mdash; Viewing page{" "}
            {responseData?.page}
          </p>
          <pre className="response">
            {JSON.stringify(responseData, null, 2)}
          </pre>
          <br />
        </>
      ) : (
        ""
      )}

      <div className="footer">
        <br />
        <br />
        <Link href="/view-all-flows#top">Go to Top</Link>
        <br />
        <br />
      </div>
    </div>
  );
}
