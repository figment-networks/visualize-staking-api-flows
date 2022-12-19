// @ts-nocheck
import Link from "next/link";
import React, { useState } from "react";
import { Button, Modal, ConfigProvider } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import styles from "/styles/Home.module.css";

import { useAppState } from "@utilities/appState";

export default function SubmitData({ operation }) {
  const { appState, setAppState } = useAppState();

  const {
    flowId,
    flowState,
    flowActions,
    flowInputs,
    flowLabels,
    inputs,
    unsignedTransactionPayload,
    accountPublicKey,
    accountAddress,
  } = appState;

  const handleLoadAccountBackup = async () => {
    if (!localStorage.getItem("accountBackup")) {
      alert("No account backup found. Please generate a new account!");
    }
    setAppState({
      ...JSON.parse(localStorage.getItem("accountBackup") || "{}"),
    });
  };

  const [inputsSent, setInputsSent] = useState(false);
  const [formData, setFormData] = useState();

  // These defaults will be used when generating the input collection form
  const defaultValues = {
    delegator_address: accountAddress
      ? accountAddress
      : "Please generate an account first!",
    delegator_pubkey: accountPublicKey
      ? accountPublicKey
      : "Please generate an account first!",
    validator_address: "legends.pool.f863973.m0",
    amount: 10,
    max_gas: null,
  };

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

  const handleStakingAPI = async () => {
    console.log("handleStakingAPI formData: ", formData);

    const response = await fetch(`/api/${operation}/submit-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    setInputsSent(true);

    console.log("submit-data result: ", result);

    // Alert user if there is an error message from the Staking API
    if (result.code) {
      alert(`${result.code}: ${result.message}`);
    }

    if (result.data) {
      console.log("Result ->", result);
      console.log(
        "data.delegate_transaction.raw: ",
        result.data.delegate_transaction.raw
      );

      setAppState({
        unsignedTransactionPayload: result.data.delegate_transaction.raw,
        validatorAddress: result.data.validator_address,
        delegateAmount: result.data.amount,
      });
    }
  };

  const handleClearFormData = async () => {
    setFormData(undefined);
    // setAppState({unsignedTransactionPayload: undefined});
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const codeSnippet = `
<form className="flowForm" onSubmit={handleSubmit} method="post">
  <label htmlFor="actions">Actions:</label>
  <select
    id="actions"
    name="actions"
    required
    defaultValue={flowActions}
    key="actions"
  >
    {Object.keys(flowActions).map((key: any) => (<>
      <option key={flowActions[key]} value={flowActions[key]}>{flowActions[key]}</option>
      </>))}
  </select>

  {inputs.map(({name, label}, index) => {
    return (
    <span key={name}>

      <label htmlFor={name}>
        {label}
      </label>
      <input
        key={name}
        type="text"
        id={name}
        name={name}
        defaultValue={defaultValues[name]}
      />
    
    </span>
  
  )})}

  <Button
    htmlType="submit" 
    type="primary" 
    style={{width: "auto", marginTop: "10px", marginBottom: "10px"}}
  >
    Create Inputs Payload
  </Button>
</form>
`;

  return (
    <>
      <div className="container">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#034d77",
              colorError: "#C90000",
            },
          }}
        >
          <div className="row">
            <h1 className={styles.title}>Submit Data to the Staking API</h1>
          </div>

          <Button
            style={{
              width: "auto",
              marginTop: "20px",
              paddingBottom: "10px",
              fontWeight: "bold",
            }}
            type="primary"
            onClick={() => showModal()}
          >
            Click Here For More Information
          </Button>

          <div className="row">
            <p className={styles.description}>
              After initializing a flow, the next step is to parse the response
              to understand which actions are available, and which data needs to
              be provided to continue the flow.
              <br />
              Click &quot;Details&quot; above for more information.
            </p>
          </div>

          <div className="row">
            <div className="column">
              {!accountAddress && !accountPublicKey ? (
                <>
                  <p>Please create an account first &rarr;</p>
                  <Button
                    style={{ width: "auto" }}
                    type="primary"
                    href="/create-near-account"
                  >
                    Create a .testnet account
                  </Button>{" "}
                  or{" "}
                  <Button
                    style={{ width: "auto" }}
                    type="primary"
                    onClick={() => handleLoadAccountBackup()}
                  >
                    Load an account backup
                  </Button>
                </>
              ) : (
                <>
                  <p>
                    Click <b>Create Inputs Payload</b> to continue.
                  </p>
                  {/* This form is explained in the Details modal when viewing the page */}
                  <form
                    className="flowForm"
                    onSubmit={handleSubmit}
                    method="post"
                  >
                    <label htmlFor="actions">Actions:</label>
                    <select
                      id="actions"
                      name="actions"
                      required
                      defaultValue={flowActions}
                      key="actions"
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
                      style={{
                        width: "auto",
                        marginTop: "10px",
                        marginBottom: "10px",
                      }}
                      type="primary"
                      htmlType="submit"
                    >
                      Create Inputs Payload
                    </Button>
                  </form>{" "}
                  {/* <-- This is the closing tag of the dynamic form  */}
                </>
              )}
            </div>

            <div className="column">
              {formData ? (
                <>
                  <p>
                    Send this JSON request body to the Staking API to continue
                    with the flow:
                  </p>

                  <pre className="payload">
                    {JSON.stringify(formData, null, 2)}
                  </pre>

                  <br />

                  {!inputsSent ? (
                    <>
                      <Button
                        style={{
                          width: "auto",
                          marginTop: "10px",
                          marginBottom: "10px",
                        }}
                        type="primary"
                        htmlType="button"
                        onClick={() => handleStakingAPI()}
                      >
                        Submit Data to Staking API
                      </Button>
                      <br />
                      <br />
                      <br />
                      <Button
                        danger
                        style={{
                          width: "auto",
                          marginTop: "10px",
                          marginBottom: "10px",
                        }}
                        type="primary"
                        htmlType="button"
                        onClick={() => handleClearFormData()}
                        icon={<WarningOutlined />}
                      >
                        Reset Inputs Payload
                      </Button>
                    </>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                <>
                  <p>
                    Request body shown after clicking{" "}
                    <b>Create Inputs Payload</b>
                  </p>

                  {/* <p>
                  Send this JSON request body to the Staking API to continue
                  with the flow:
                </p> */}
                  <p className="spacer">
                    {/* This spacer intentionally left blank */}
                  </p>
                </>
              )}

              {unsignedTransactionPayload && inputsSent ? (
                <>
                  <p>
                    Based on the inputs above, an unsigned transaction payload
                    is created by the Staking API,
                    <br /> using the <code>action</code> and <code>inputs</code>
                    :{" "}
                  </p>
                  <div
                    className="response"
                    onClick={() =>
                      navigator.clipboard.writeText(unsignedTransactionPayload)
                    }
                  >
                    {unsignedTransactionPayload}
                  </div>{" "}
                  <br />
                  <p>
                    This payload must be signed using the cryptographic private
                    key of the delegator account.
                  </p>
                  <br />
                  <Button
                    type="primary"
                    onClick={() => setAppState({ stepCompleted: 2 })}
                    href={`/operations/${operation}/sign-payload`}
                  >
                    Proceed to the next step &rarr;
                  </Button>
                  <br />
                  <br />
                </>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="footer">
            <Link href="/">Return to Main Page</Link>
          </div>

          <Modal
            title="Details"
            width="40%"
            footer={null}
            open={isModalOpen}
            onCancel={handleCancel}
          >
            <ul>
              <li>
                Flow ID: <b>{flowId}</b>
              </li>
              <li>
                Flow State: <b>{flowState}</b>
              </li>
              <br />
              <li>
                The flow <code>actions</code>
                {" , "}
                <code>inputs</code> and labels used to build the form come from
                the Staking API response.
                <br />
                In this context, they&apos;re set in the app state by the{" "}
                <code>handleInitializeFlow</code> function in{" "}
                <code>components/InitializeFlow.jsx</code>
              </li>
              <br />
              <li>
                Flow Action(s): <b>{flowActions}</b>
              </li>
              <li>
                Action Inputs: <b>{flowInputs.join(", ")}</b>
              </li>
              <li>
                Action Labels: <b>{flowLabels.join(", ")}</b>
              </li>
              <h3>Default Values (Staking flow only)</h3>
              <li>
                Delegator Address: <b>{accountAddress}</b>
              </li>
              <li>
                Delegator Public Key: <b>{accountPublicKey}</b>
              </li>
              <li>
                Validator Address: <b>legends.pool.f863973.m0</b>
              </li>
              <li>
                Amount: <b>10.0</b>
              </li>
              <li>
                Max Gas: This value is <i>optional</i>, so it&apos;s OK to leave
                it empty! Read more about{" "}
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://docs.near.org/concepts/basics/transactions/gas"
                >
                  gas costs on NEAR
                </Link>
                . Setting max gas can be useful when running transactions on
                mainnet.
              </li>
              <br />
              <li>
                Find the parameters and response for a staking flow on NEAR in
                the guide{" "}
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://docs.figment.io/guides/staking-api/near/delegate/submit-delegate-data"
                >
                  Submit Delegate Data
                </Link>
              </li>
              <br />

              <li>
                Consult the block explorer to find a{" "}
                <Link href="https://explorer.testnet.near.org/nodes/validators">
                  list of NEAR testnet validators
                </Link>
              </li>
              <br />

              <li>
                To build a form for collecting inputs using the Staking API
                response values, consider the following JSX code:
                <details>
                  <summary>Click here to expand code snippet</summary>
                  <pre className="detailcode">{codeSnippet}</pre>
                </details>
                <br />
                By iterating over all of the <code>actions</code> and{" "}
                <code>inputs</code> from the Staking API response, we can
                quickly build the dynamic forms we need to capture the data.
              </li>
              <li>
                If you&apos;re using React for this, remember to supply a unique{" "}
                <code>key</code> for each item in a list!
              </li>
            </ul>
          </Modal>
        </ConfigProvider>
      </div>
    </>
  );
}
