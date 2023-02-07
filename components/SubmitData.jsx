// @ts-nocheck
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Row, Col, Modal, Steps } from "antd";
import {
  LoadingOutlined,
  WarningOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import styles from "/styles/Home.module.css";
import { useAppState } from "@utilities/appState";

import ToolTip from "@components/elements/ToolTip";

import {
  Title,
  BreadCrumbs,
  Button,
  Card,
  Formatted,
  ColumnLayout,
  Footer,
} from "@pages/ui-components";

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
    errorResponse,
    errorResponseTimestamp,
  } = appState;

  const [isLoading, setIsLoading] = useState(false);
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
    const data = {
      ...formData,
      flow_id: flowId,
    };

    setIsLoading(true);

    const response = await fetch(`/api/${operation}/submit-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const { result, date } = await response.json();

    setInputsSent(true);
    setIsLoading(false);

    console.log("submit-data return timestamp: ", date);
    console.log("submit-data result: ", result);

    // Alert user if there is a general error message from the Staking API
    if (result.code) {
      // alert(`${result.code}: ${result.message}`);
      setAppState({ errorResponse: result, errorResponseTimestamp: date });
    }

    // Alert user if there are validation errors from the Staking API
    if (result.code === "invalid") {
      // alert(`${result.code}: ${JSON.stringify(result.errors, null, 2)}`);
      setAppState({ errorResponse: result, errorResponseTimestamp: date });
    }

    if (result.data) {
      console.log(
        "The unsigned transaction payload for a staking flow can be found in the Staking API response - data.delegate_transaction.raw: ",
        result.data.delegate_transaction.raw
      );

      // Retain these values in appState so they can be confirmed by decoding the payload
      setAppState({
        flowResponse: result,
        unsignedTransactionPayload: result.data.delegate_transaction.raw,
        validatorAddress: result.data.validator_address,
        delegateAmount: result.data.amount,
      });
    }
  };

  const handleClearFormData = async () => {
    setFormData(undefined);
    setInputsSent(false);
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

  return (
    <>
      <BreadCrumbs step={2} />
      <ColumnLayout title={<Title>Submit Data to the Staking API</Title>}>
        <ColumnLayout.Column
          style={{
            padding: "0",
            flexShrink: "0",
            width: "100%",
            marginBottom: "2.4rem",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Card small>
            <p>
              After creating a flow, the next step is to check the response to
              understand which actions are available, and which data needs to be
              provided to continue the flow.
            </p>
            <p>
              The form below has been created based on the Staking API response
              and provided with default values.
            </p>
            <Button secondary small onClick={() => showModal()}>
              Click Here For More Information
            </Button>
          </Card>
        </ColumnLayout.Column>

        <ColumnLayout.Column>
          {!accountAddress && !accountPublicKey ? (
            <>
              <Card small>
                <p>
                  Please create an account first!
                  <Button href="/create-near-account">
                    Create a NEAR testnet account
                  </Button>
                </p>
              </Card>
            </>
          ) : (
            <>
              <p>
                Please review the inputs, then click{" "}
                <b>Create Inputs Payload</b> to continue.
              </p>
              <Card small>
                <form onSubmit={handleSubmit} method="post">
                  <label htmlFor="actions">Action(s):</label>
                  <select
                    id="actions"
                    name="actions"
                    required
                    defaultValue={flowActions[0]}
                    multiple={false}
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
                        <label htmlFor={name}>{label}:</label>
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
                  <br />
                  <Button disabled={formData}>Create Inputs Payload</Button>
                </form>
              </Card>
            </>
          )}
        </ColumnLayout.Column>

        <ColumnLayout.Column>
          {formData ? (
            <>
              <p>
                Send this JSON request body to the{" "}
                <ToolTip
                  style={{ textDecoration: "underline" }}
                  placement="top"
                  title={`/api/v1/flows/<flow_id>/next - Refer to the Figment Docs for more information.`}
                >
                  Staking API endpoint
                </ToolTip>{" "}
                to continue with the flow:
              </p>

              <Formatted block>{JSON.stringify(formData, null, 2)}</Formatted>

              {/* {!inputsSent && ( */}
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <Button
                  disabled={isLoading}
                  secondary
                  onClick={() => handleClearFormData()}
                >
                  Reset Inputs Payload
                </Button>
                <Button disabled={isLoading} onClick={() => handleStakingAPI()}>
                  Submit Data to Staking API
                </Button>
              </div>
              {/* )} */}
            </>
          ) : (
            <>
              <br />
              <br />
              <p className={styles.spacer}>
                Request body displayed here after clicking{" "}
                <b>Create Inputs Payload</b>
              </p>
            </>
          )}

          {isLoading && (
            <>
              <br />
              <Card small>
                <p>
                  <LoadingOutlined /> Loading...
                </p>
              </Card>
            </>
          )}

          {!isLoading && !unsignedTransactionPayload && inputsSent && (
            <>
              <Card small style={{ marginTop: "2rem" }}>
                <ToolTip
                  placement="left"
                  title={`Data was submitted to /api/v1/flows/${flowId} at ${errorResponseTimestamp} - the presence of validation errors does not mean that the inputs were incorrect.`}
                >
                  <p className={styles.callout}>
                    <b>
                      <WarningOutlined /> Validation error(s) occurred when
                      submitting this data to the Staking API.
                    </b>
                    <br />
                    <br />
                    Default values supplied by this app should not cause
                    validation errors under normal circumstances. If the inputs
                    you sent are known to be valid, this could indicate an issue
                    with NEAR testnet nodes used by the Staking API.
                    <br />
                    <br />
                    <LinkOutlined />{" "}
                    <Link
                      href={`https://explorer.testnet.near.org/accounts/${formData.inputs.delegator_address}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Check Delegator Address
                    </Link>
                    <br />
                    <LinkOutlined />{" "}
                    <Link
                      href={`https://explorer.testnet.near.org/nodes/validators/${formData.inputs.validator_address}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Check Validator Address
                    </Link>
                    <br />
                    <br />
                    If both the Delegator address and Validator address exist,
                    please contact Figment Support via email:{" "}
                    <Link href="mailto:technical.support@figment.io?cc=rogan%40figment.io&subject=Visualize%20Flows%20Validation%20Errors&body=Hello%2C%0D%0A%0D%0AWhile%20using%20the%20Visualize%20Staking%20API%20Flows%20app%20from%20Figment%2C%20I%20encountered%20validation%20errors%20while%20attempting%20to%20create%20a%20delegate%20transaction.%0D%0A%0D%0A----%0D%0APlease%20include%20any%20other%20information%20regarding%20your%20use%20of%20the%20Visualize%20Flows%20app%20that%20you%20would%20like%20to%20pass%20along%20to%20Figment%20Technical%20Support%20below%3A">
                      technical.support@figment.io
                    </Link>
                    .
                  </p>
                  <Formatted block>
                    {JSON.stringify(errorResponse, null, 2)}
                  </Formatted>
                </ToolTip>
              </Card>
            </>
          )}

          {unsignedTransactionPayload && inputsSent && (
            <Card small>
              <p>
                The flow state has changed from{" "}
                <Formatted>initialized</Formatted> to{" "}
                <Formatted>delegate_tx_signature</Formatted>, indicating that
                the Staking API now requires a signed transaction. In the next
                step, we will examine the signing process.
              </p>
              <details>
                <summary>Click here to see the full response</summary>
                <Formatted block maxHeight="510px">
                  {JSON.stringify(flowResponse, null, 2)}
                </Formatted>{" "}
              </details>

              <p>
                An unsigned{" "}
                <ToolTip
                  style={{ textDecoration: "underline" }}
                  placement="top"
                  title={`In terms of the Staking API, a transaction payload is a hashed representation of the inputs belonging to an action. It must be signed before it can be broadcast by the Staking API.`}
                >
                  transaction payload
                </ToolTip>{" "}
                has been created by the Staking API based on the submitted{" "}
                <Formatted>action</Formatted> and <Formatted>inputs</Formatted>.
              </p>

              <details>
                <summary>Click here to see the payload</summary>
                <Formatted block>{unsignedTransactionPayload}</Formatted>{" "}
              </details>

              <Button
                onClick={() => setAppState({ stepCompleted: 2 })}
                href={`/operations/${operation}/sign-payload`}
              >
                Proceed to the next step &rarr;
              </Button>
            </Card>
          )}
        </ColumnLayout.Column>

        <Footer />
      </ColumnLayout>

      <Modal
        title="Details"
        width="calc(50% - 10px)"
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
      >
        <ul>
          <li>
            The flow provides <Formatted>actions</Formatted>
            {" & "}
            <Formatted>inputs</Formatted> names and{" "}
            <Formatted>display</Formatted> labels used to build the form on this
            page. These values are included in the Staking API response when the
            flow is created. The values shown here are taken directly from the
            response:
          </li>
          <li>
            <details>
              <summary>Click here to see the full Staking API response</summary>
              <ul>
                <li>
                  Flow Action(s): <b>{flowActions}</b> comes from{" "}
                  <Formatted>actions[0].name</Formatted>
                </li>
                <li>
                  Action Inputs: <b>{flowInputs.join(", ")}</b> come from{" "}
                  <Formatted>actions[0].inputs[0].name</Formatted>,{" "}
                  <Formatted>actions[0].inputs[1].name</Formatted> etc.
                </li>
                <li>
                  Action Display Label: <b>{flowLabels.join(", ")}</b> come from{" "}
                  <Formatted>actions[0].inputs[0].display</Formatted>,{" "}
                  <Formatted>actions[0].inputs[1].display</Formatted> etc.
                </li>
              </ul>
              <Formatted block maxHeight="250px">
                {JSON.stringify(flowResponse, null, 2)}
              </Formatted>
            </details>
          </li>
          <br />
          <li>
            The form on this page is created from the values in the response,
            with the following JavaScript + React (JSX) code:
            <details>
              <summary>Click here to expand code snippet</summary>
              <p>
                The form inputs are obtained by iterating over the{" "}
                <Formatted>actions</Formatted> and <Formatted>inputs</Formatted>{" "}
                from the Staking API response. Here we are using the JavaScript{" "}
                <Formatted>map()</Formatted> method. This form is used to gather
                the information needed by the Staking API to create the
                transaction payload:
              </p>

              <Formatted block maxHeight="365px">
                {codeSnippet}
              </Formatted>

              <p>
                Since we&apos;re using React for this, we must supply a unique{" "}
                <Formatted>key</Formatted> property for each item in the list!
              </p>

              <p>
                To gather the form input values, the{" "}
                <Formatted>handleSubmit</Formatted> function is called by the
                form&apos;s <Formatted>onSubmit</Formatted> handler when the
                form&apos;s submit button is clicked. In this context,
                we&apos;re adding the form data to a state variable{" "}
                <Formatted>formData</Formatted> for later use:
              </p>

              <Formatted block maxHeight="365px">
                {codeSnippetSubmit}
              </Formatted>
            </details>
          </li>
          <br />

          <li>
            Parameters and responses for Staking API flows are detailed in{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.figment.io/guides/staking-api/near/delegate/submit-delegate-data"
            >
              network-specific Guides
            </Link>{" "}
            on the Figment Docs.
          </li>
          <br />

          <h6>&darr; Default Values for this staking flow</h6>
          <br />
          <li>
            We&apos;ll use the account generated by this app as the delegator
            account:
            <ul>
              <li>
                Delegator Address: <b>{accountAddress}</b>
              </li>
              <li>
                Delegator Public Key: <b>{accountPublicKey}</b>
              </li>
            </ul>
          </li>
          <br />

          <li>
            This default validator address comes from the list of NEAR{" "}
            <Link href="https://explorer.testnet.near.org/nodes/validators">
              testnet validators
            </Link>
            :
          </li>
          <ul>
            <li>
              Validator Address: <b>legends.pool.f863973.m0</b>
            </li>
          </ul>
          <br />

          <li>
            Every new testnet account is supplied with 200 NEAR tokens upon
            creation.
            <br />
            We&apos;re arbitrarily selecting a default value of{" "}
            <b>10 NEAR tokens</b> to stake:
          </li>
          <ul>
            <li>
              Amount: <b>10.0</b>
            </li>
          </ul>
          <br />

          <li>
            The Max Gas value is <i>optional</i>, so it&apos;s OK to leave it
            empty &mdash; Read more about{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.near.org/concepts/basics/transactions/gas"
            >
              gas costs on NEAR
            </Link>
          </li>
          <ul>
            <li>
              Max Gas: <b>null</b>
            </li>
          </ul>
          <br />
        </ul>
      </Modal>
    </>
  );
}
