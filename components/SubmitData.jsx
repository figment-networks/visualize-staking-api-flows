import Link from "next/link";
import { FormEvent, useState, useEffect } from "react";
import styles from "/styles/Home.module.css";
import { Button, Modal } from "antd";

import { useAppState } from "@utilities/appState";

export default function SubmitData({ operation }) {
  const { appState, setAppState } = useAppState();

  // Destructure state variables
  const {
    flowId,
    flowResponse,
    flowState,
    flowActions,
    flowInputs,
    flowLabels,
    responseData,
    inputs,
    unsignedTransactionPayload,
    accountPublicKey,
    accountAddress,
    validatorAddress,
  } = appState;

  const [inputsSent, setInputsSent] = useState(false);
  const [formData, setFormData] = useState();

  // These defaults will be used when generating the input collection form
  const defaultValues = {
    delegator_address: accountAddress,
    delegator_pubkey: accountPublicKey,
    validator_address: "legends.pool.f863973.m0",
    amount: 10,
    max_gas: null,
  };

  useEffect(() => {
    localStorage.setItem("INPUTS", JSON.stringify(formData));
    console.log(
      "Saved Inputs to localStorage: ",
      localStorage.getItem("INPUTS")
    );
  }, [formData]);

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

    setInputsSent(true);

    const result = await response.json();

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
              Find the parameters and response for a staking flow on NEAR in the
              guide{" "}
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
              <code>inputs</code> from the Staking API response, we can quickly
              build the dynamic forms we need to capture the data.
            </li>
            <li>
              If you&apos;re using React for this, remember to supply a unique{" "}
              <code>key</code> for each item in a list!
            </li>
          </ul>
        </Modal>

        <div className="row">
          <h1 className={styles.title}>Submit Data to the Staking API</h1>
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
            After initializing a flow, the next step is to parse the response to
            understand which actions are available, and which data needs to be
            provided to continue the flow.
            <br />
            Click &quot;Details&quot; above for more information.
          </p>
        </div>
        <div className="row">
          <div className="column">
            <p>
              Click <b>Create Inputs Payload</b> to continue.
            </p>
            {/* This form is explained in the Details modal when viewing the page */}
            <form className="flowForm" onSubmit={handleSubmit} method="post">
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
                    <option key={flowActions[key]} value={flowActions[key]}>
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
          </div>

          <div className="column">
            {formData ? (
              <>
                <p>
                  Send this JSON request body to the Staking API to continue
                  with the flow:
                </p>

                <div className="payload">
                  {JSON.stringify(formData, null, 2)}
                </div>
                <br />
                <br />
                <Button
                  style={{
                    width: "auto",
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                  type="primary"
                  htmlType="button"
                  onClick={handleStakingAPI}
                >
                  Submit Data to Staking API
                </Button>
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
                  onClick={handleClearFormData}
                >
                  Reset Inputs Payload
                </Button>
              </>
            ) : (
              <>
                <p>
                  This is where the request body will appear when you click{" "}
                  <b>Create Inputs Payload</b>
                </p>
                <p className="spacer">
                  {/* This spacer intentionally left blank */}
                </p>
              </>
            )}

            <br />

            {unsignedTransactionPayload && inputsSent ? (
              <>
                <p>
                  {" "}
                  The unsigned transaction payload is created by the Staking
                  API,
                  <br /> based on the <code>action</code> and{" "}
                  <code>inputs</code>.{" "}
                </p>
                <p> Transaction Payload to Sign (click to copy) </p>
                <div
                  className="payload"
                  onClick={() =>
                    navigator.clipboard.writeText(unsignedTransactionPayload)
                  }
                >
                  {unsignedTransactionPayload}
                </div>{" "}
                <br />
                <br />
                <Button
                  type="primary"
                  href={`/operations/${operation}/sign-payload`}
                >
                  Proceed to the next step &rarr;
                </Button>
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
      </div>
    </>
  );
}
