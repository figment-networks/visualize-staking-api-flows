// @ts-nocheck
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Row, Col, Button, Modal, Steps, Tooltip } from "antd";
import {
  WarningOutlined,
  SolutionOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import styles from "/styles/Home.module.css";
import Footer from "@components/Footer";

import { useAppState } from "@utilities/appState";

export default function SubmitData({ operation }) {
  const { appState, setAppState } = useAppState();

  const {
    flowId,
    flowState,
    flowResponse,
    flowActions,
    flowInputs,
    flowLabels,
    inputs,
    unsignedTransactionPayload,
    accountPublicKey,
    accountAddress,
  } = appState;

  const [inputsSent, setInputsSent] = useState(false);
  const [formData, setFormData] = useState();

  // Default values for the input collection form of a `staking` flow operation
  const defaultValues = {
    delegator_address: accountAddress
      ? accountAddress
      : "Please generate an account first!",
    delegator_pubkey: accountPublicKey
      ? accountPublicKey
      : "Please generate an account first!",
    // For a list of NEAR testnet validators, see https://explorer.testnet.near.org/nodes/validators
    validator_address: "legends.pool.f863973.m0",
    amount: 10,
    max_gas: null,
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;

    const data = {
      action: form.actions.value,
      inputs: {
        delegator_address: form.delegator_address.value,
        delegator_pubkey: form.delegator_pubkey.value,
        validator_address: form.validator_address.value,
        amount: form.amount.value,
        max_gas: form.max_gas.value ? form.max_gas.value : null,
      },
    };
    setFormData(data);
    setInputsSent(false);
  };

  const handleStakingAPI = async () => {
    console.log("handleStakingAPI formData: ", formData);

    const accountBackup = localStorage.getItem(
      "visualize-staking-api-flows_accountBackup"
    );

    // setAppState({ accountAddress: accountBackup.accountAddress , accountPublicKey: accountPublicKey})

    const data = {
      ...formData,
      flow_id: flowId,
    };

    const response = await fetch(`/api/${operation}/submit-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    setInputsSent(true);

    console.log("submit-data result: ", result);

    // Alert user if there is an error message from the Staking API
    if (result.code) {
      alert(`${result.code}: ${result.message}`);
    }

    if (result.data) {
      console.log(
        "The unsigned transaction payload for a staking flow can be found in the Staking API response - data.delegate_transaction.raw: ",
        result.data.delegate_transaction.raw
      );

      // Retain these values in appState so they can be confirmed by decoding the payload
      setAppState({
        unsignedTransactionPayload: result.data.delegate_transaction.raw,
        validatorAddress: result.data.validator_address,
        delegateAmount: result.data.amount,
      });
    }
  };

  const handleClearFormData = async () => {
    setFormData(undefined);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // These code snippets are shown inside the More Information modal to
  // demonstrate how an inputs form can be mapped from the Staking API response
  const codeSnippet = `
<form
  className="flowForm"
  onSubmit={handleSubmit}
  method="post"
>
  <label htmlFor="actions">Actions:</label>
  <select
    key="actions"
    id="actions"
    name="actions"
    defaultValue={flowActions}
    required
  >
    {Object.keys(flowActions).map((key) => (
      <>
        <option
          key={flowActions[key]}
          value={flowActions[key]}
        >
          {flowActions[key]}
        </option>
      </>
    ))}
  </select>

  {inputs.map(({ name, label }, index) => {
    return (
      <span key={name}>
        <label htmlFor={name}>{label}</label>
        <input
          key={name}
          type="text"
          id={name}
          name={name}
          defaultValue={defaultValues[name]}
        />
      </span>
    );
  })}
  <Button
    disabled={formData}
    className={styles.submitButton}
    type="primary"
    htmlType="submit"
  >
    Create Inputs Payload
  </Button>
</form>
`;

  const codeSnippetSubmit = `
const handleSubmit = async (event) => {
  event.preventDefault();
  const form = event.target;

  const data = {
    flow_id: flowId,
    action: form.actions.value,
    inputs: {
      delegator_address: form.delegator_address.value,
      delegator_pubkey: form.delegator_pubkey.value,
      validator_address: form.validator_address.value,
      amount: form.amount.value,
      max_gas: form.max_gas.value ? form.max_gas.value : null,
    },
  };
  setFormData(data);
  setInputsSent(false);
};
`;

  useEffect(() => {
    if (localStorage.getItem("visualize-staking-api-flows_accountBackup")) {
      console.log(
        localStorage.getItem("visualize-staking-api-flows_accountBackup")
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Row justify="space-around">
        <Col span={24}>
          <div className={styles.header}>
            <Steps
              current={2}
              status="finish"
              type="navigation"
              // className={(styles.description, styles.progress)}
              items={[
                {
                  title: "Create Account",
                  status: "finish",
                  icon: <CheckCircleOutlined />,
                  onClick: () => {
                    alert("!");
                  },
                },
                {
                  title: "Create a Flow",
                  status: "finish",
                  icon: <CheckCircleOutlined />,
                },
                {
                  title: "Submit Data",
                  status: "process",
                  icon: <SolutionOutlined />,
                },
                {
                  title: "Decode & Sign Payload",
                  status: "wait",
                  icon: <SolutionOutlined />,
                },
                {
                  title: "Broadcast Transaction",
                  status: "wait",
                  icon: <SolutionOutlined />,
                },
                {
                  title: "Get Flow State",
                  status: "wait",
                  icon: <SolutionOutlined />,
                },
                {
                  title: "View All Flows",
                  status: "wait",
                  icon: <SolutionOutlined />,
                },
              ]}
            />
          </div>
        </Col>
      </Row>

      <h1 className={styles.title}>Submit Data to the Staking API</h1>

      <Row justify="space-around">
        <Col span={10}>
          <p className={styles.description}>
            After creating a flow, the next step is to check the response to
            understand which actions are available, and which data needs to be
            provided to continue the flow.
            <br />
            <br />
            The form below has been created based on the Staking API response
            and provided with default values.
            <br />
            <Button
              size="large"
              type="text"
              className={styles.modalButton}
              onClick={() => showModal()}
            >
              Click Here For More Information
            </Button>
          </p>
        </Col>
      </Row>

      <Row className={styles.paddingBottom}>
        <Col span={10}>
          {!accountAddress && !accountPublicKey ? (
            <>
              <p className={styles.description}>
                Please create an account first &rarr;
              </p>
              <Button
                style={{ width: "auto" }}
                type="primary"
                href="/create-near-account"
              >
                Create a .testnet account
              </Button>
            </>
          ) : (
            <>
              <p className={styles.centerLabel}>
                Click <b>Create Inputs Payload</b> to continue.
              </p>
              {/* This dynamic form is explained in the More Information modal when viewing the page */}
              <form className="flowForm" onSubmit={handleSubmit} method="post">
                <label htmlFor="actions" className={styles.leftLabel}>
                  Action(s):
                </label>
                <select
                  id="actions"
                  name="actions"
                  required
                  defaultValue={flowActions}
                  key="actions"
                  className={styles.selectInput}
                >
                  {Object.keys(flowActions).map((key) => (
                    <>
                      <option key={flowActions[key]} value={flowActions[key]}>
                        {flowActions[key]}
                      </option>
                    </>
                  ))}
                </select>

                {inputs.map(({ name, label }, index) => {
                  return (
                    <span key={name}>
                      <label htmlFor={name} className={styles.leftLabel}>
                        {label}:
                      </label>
                      <input
                        key={name}
                        type="text"
                        id={name}
                        name={name}
                        defaultValue={defaultValues[name]}
                      />
                    </span>
                  );
                })}
                <Button
                  disabled={formData}
                  className={styles.submitButton}
                  type="primary"
                  htmlType="submit"
                >
                  Create Inputs Payload
                </Button>
              </form>
              <br />
              <br />
            </>
          )}
        </Col>

        <Col span={14}>
          {formData ? (
            <>
              <p className={styles.desc}>
                Send this JSON request body to the{" "}
                <Tooltip
                  placement="top"
                  className={styles.ttip}
                  title={`/api/v1/flows/<flow_id>/next - Refer to the Figment Docs for more information.`}
                  arrowPointAtCenter
                >
                  Staking API endpoint
                </Tooltip>{" "}
                to continue with the flow:
              </p>
              <pre className="payload">{JSON.stringify(formData, null, 2)}</pre>

              <br />

              {!inputsSent && (
                <>
                  <Button
                    type="primary"
                    htmlType="button"
                    className={styles.proceedButton}
                    onClick={() => handleStakingAPI()}
                  >
                    Submit Data to Staking API
                  </Button>
                  <br />
                  <Button
                    className={styles.resetButton}
                    type="text"
                    htmlType="button"
                    onClick={() => handleClearFormData()}
                    icon={<WarningOutlined />}
                  >
                    Reset Inputs Payload
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              <br />
              <br />
              <p className="spacer">
                Request body displayed here after clicking{" "}
                <b>Create Inputs Payload</b>
              </p>
            </>
          )}

          {unsignedTransactionPayload && inputsSent && (
            <>
              <p className={styles.desc}>
                An unsigned{" "}
                <Tooltip
                  placement="top"
                  className={styles.ttip}
                  title={`In terms of the Staking API, a transaction payload is a hashed representation of the inputs belonging to an action. It must be signed before it can be broadcast by the Staking API.`}
                  arrowPointAtCenter
                >
                  transaction payload
                </Tooltip>{" "}
                has been created by the Staking API
                <br />
                based on the submitted <code>action</code> and{" "}
                <code>inputs</code>:<br />
              </p>
              <details style={{ width: "680px" }}>
                <summary>Click here to see the payload</summary>
                <h3>&darr; Scroll down to view the entire payload</h3>
                <pre
                  className="payload"
                  onClick={() =>
                    navigator.clipboard.writeText(unsignedTransactionPayload)
                  }
                >
                  {unsignedTransactionPayload}
                </pre>{" "}
              </details>
              <Button
                className={styles.proceedButton}
                size="large"
                type="primary"
                onClick={() => setAppState({ stepCompleted: 2 })}
                href={`/operations/${operation}/sign-payload`}
              >
                Proceed to the next step &rarr;
              </Button>
            </>
          )}
        </Col>
      </Row>

      <Footer />

      <Modal
        title="Details"
        width="calc(40% - 10px)"
        footer={null}
        open={isModalOpen}
        onCancel={closeModal}
      >
        <ul>
          <li>
            The flow <code>actions</code>
            {" , "}
            <code>inputs</code> and <code>display</code> labels used to build
            the form on this page come from the Staking API response when the
            flow is created. The values shown here are taken directly from the
            response:
          </li>
          <li>
            <details>
              <summary>Click here to see the full Staking API response</summary>
              <ul>
                <li>
                  Flow Action(s): <b>{flowActions}</b> comes from{" "}
                  <code>actions[0].name</code>
                </li>
                <li>
                  Action Inputs: <b>{flowInputs.join(", ")}</b> come from{" "}
                  <code>actions[0].inputs[0].name</code>,{" "}
                  <code>actions[0].inputs[1].name</code> etc.
                </li>
                <li>
                  Action Display Label: <b>{flowLabels.join(", ")}</b> come from{" "}
                  <code>actions[0].inputs[0].display</code>,{" "}
                  <code>actions[0].inputs[1].display</code> etc.
                </li>
              </ul>
              <pre className={styles.codeDetail}>
                {JSON.stringify(flowResponse, null, 2)}
              </pre>
            </details>
          </li>
          <br />
          <li>
            The form on this page is created from the values in the response,
            with the following JavaScript + React (JSX) code:
            <details>
              <summary>Click here to expand code snippet</summary>
              <p style={{ padding: "10px" }}>
                The form inputs are obtained by iterating over the{" "}
                <code>actions</code> and <code>inputs</code> from the Staking
                API response. Here we are using the JavaScript{" "}
                <code>map()</code> method. This form is used to gather the
                information needed by the Staking API to create the transaction
                payload:
              </p>

              <pre className={styles.codeDetail}>{codeSnippet}</pre>

              <p style={{ padding: "10px" }}>
                Since we&apos;re using React for this, we must supply a unique{" "}
                <code>key</code> property for each item in the list!
              </p>

              <p style={{ padding: "10px" }}>
                To gather the form input values, the <code>handleSubmit</code>{" "}
                function is called by the form&apos;s <code>onSubmit</code>{" "}
                handler when the form&apos;s submit button is clicked. In this
                context, we&apos;re adding the form data to a state variable{" "}
                <code>formData</code> for later use:
              </p>

              <pre className={styles.codeDetail}>{codeSnippetSubmit}</pre>
              <br />
            </details>
          </li>
          <h3>Default Values (Staking flow)</h3>
          <h4>
            We&apos;ll use the account generated by this app as the delegator
            account:
          </h4>
          <ul>
            <li>
              Delegator Address: <b>{accountAddress}</b>
            </li>
            <li>
              Delegator Public Key: <b>{accountPublicKey}</b>
            </li>
          </ul>
          <h4>
            This default comes from the list of NEAR{" "}
            <Link href="https://explorer.testnet.near.org/nodes/validators">
              testnet validators
            </Link>
            :
          </h4>
          <ul>
            <li>
              Validator Address: <b>legends.pool.f863973.m0</b>
            </li>
          </ul>
          <h4>
            Every new testnet account is supplied with 200 NEAR tokens upon
            creation.
            <br />
            We&apos;re arbitrarily selecting a default value of{" "}
            <b>10 NEAR tokens</b> to stake:
          </h4>
          <ul>
            <li>
              Amount: <b>10.0</b>
            </li>
          </ul>
          <h4>
            The Max Gas value is <i>optional</i>, so it&apos;s OK to leave it
            empty! If you&apos;re interested, read more about{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.near.org/concepts/basics/transactions/gas"
            >
              gas costs on NEAR
            </Link>{" "}
          </h4>
          <ul>
            <li>Max Gas: null</li>
          </ul>
          <br />
          <li>
            Parameters and response for a staking flow on NEAR are detailed in
            the{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.figment.io/guides/staking-api/near/delegate/submit-delegate-data"
            >
              Submit Delegate Data
            </Link>{" "}
            guide on the Figment Docs.
          </li>
          <br />
        </ul>
      </Modal>
    </>
  );
}
