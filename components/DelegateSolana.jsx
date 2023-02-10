// @ts-nocheck
import React, { useState } from "react";
import Link from "next/link";
import { Modal } from "antd";
import {
  LoadingOutlined,
  WarningOutlined,
  LinkOutlined,
} from "@ant-design/icons";

import {
  DESCRIPTION,
  Head,
  BreadCrumbs,
  Title,
  Card,
  Button,
  Formatted,
  LayoutColumn,
  ToolTip,
  Footer,
} from "@components/ui-components";

import { useAppState } from "@utilities/appState";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const solscanUrl = (op, address, cluster) =>
  `https://solscan.io/${op}/${address}?cluster=${cluster}`;

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
    actionInputs,
    action0Inputs,
    action1Inputs,
    unsignedTransactionPayload,
    stepCompleted,
    accountPublicKey,
    accountAddress,
    errorResponse,
    errorResponseTimestamp,
    transitionErrorResponse,
    sol_accountPublicKey,
    sol_accountPrivateKey,
    sol_stakeAccount,
    responseData,
  } = appState;

  const [isLoading, setIsLoading] = useState(false);
  const [inputsSent, setInputsSent] = useState(false);
  const [formData, setFormData] = useState();
  const [selectedAction, setSelectedAction] = useState("create_delegate_tx");
  const [transactionBroadcast, setTransactionBroadcast] = useState(false);

  // For a list of Solana Devnet validators, see https://docs.solana.com/clusters#devnet
  const knownDevnetValidatorAddresses = [
    "7bgCqKDWhZdVrfM9QY39uEiU2qb8W7FN3cXeiz5YFRyK",
  ];

  // Default values for the input collection form of a `staking` flow operation
  const defaultValues = {
    validator_address: knownDevnetValidatorAddresses[0],
  };

  const defaultValuesNewStakingAccount = {
    funding_account_pubkey: sol_accountPublicKey
      ? sol_accountPublicKey
      : "Please generate an account first!",
    stake_authority_pubkey: null,
    withdraw_authority_pubkey: null,
    amount: 2.0,
  };

  const handleCreateDelegateTx = async (event) => {
    function getInputsForAction(action) {
      return action?.inputs.flatMap((input) => [
        {
          action: action.name,
          name: input.name,
          display: input.display,
        },
      ]);
    }

    setAppState({
      flowActions: responseData.actions.map((action) => action.name),
      flowInputs: responseData.actions.flatMap((action) =>
        getInputsForAction(action)
      ),
      flowLabels: responseData.actions.flatMap((action) =>
        action.inputs.map((input) => input.display)
      ),
      action0Inputs: getInputsForAction(responseData.actions[0]),
      action1Inputs: getInputsForAction(responseData.actions[1]),
    });
  };

  const handleSubmitDelegate = async (event) => {
    event.preventDefault();
    const form = event.target;
    let data = {};
    if (selectedAction === "create_delegate_tx") {
      data = {
        action: form.actions.value,
        inputs: {
          validator_address: form.validator_address.value,
        },
      };
    }
    setFormData(data);
    setInputsSent(false);
  };

  const handleSignAndBroadcastPayload = async () => {
    // Note: This is NOT a production-grade pattern to provide
    // the private key for signing. This is only being done as
    // part of this action to simplify the signing process for
    // the purposes of this walkthrough.
    // Your implementation will need to account for security.
    const data = {
      flow_id: flowId,
      transaction_payload: unsignedTransactionPayload,
      privateKey: sol_accountPrivateKey,
    };

    setIsLoading(true);
    const response = await fetch(`/api/sol-staking/sign-payload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    setAppState({ signedTransactionPayload: result });

    const dataNext = {
      flow_id: flowId,
      action: "sign_delegate_tx",
      signed_payload: result,
      privateKey: sol_accountPrivateKey,
    };

    const responseNext = await fetch(`/api/sol-staking/broadcast-transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataNext),
    });
    const resultNext = await responseNext.json();

    setIsLoading(false);
    setTransactionBroadcast(true);

    if (resultNext?.code === "invalid") {
      setAppState({ errorResponse: result, errorResponseTimestamp: date });
    }

    if (resultNext.code) {
      alert(`${result.code}: ${result.message}`);
    }

    if (resultNext.data) {
      setAppState({ flowState: result.state, flowResponse: result });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    let data = {};

    if (selectedAction === "create_new_stake_account") {
      data = {
        action: form.actions.value,
        inputs: {
          funding_account_pubkey: form.funding_account_pubkey.value,
          amount: form.amount.value,
        },
      };
    }
    setFormData(data);
    setInputsSent(false);
  };

  const handleStakingAPI = async () => {
    const data = {
      ...formData,
      flow_id: flowId,
    };

    if (flowState !== "stake_account") {
      alert(
        `Flow state is not stake_account - create_delegate_tx will fail with a transition error.`
      );
    }

    setIsLoading(true);

    const response = await fetch(`/api/sol-staking/submit-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const { result, date } = await response.json();

    setInputsSent(true);
    setIsLoading(false);

    if (result?.data) {
      console.log(
        "The unsigned transaction payload for a staking flow can be found in the Staking API response - data.delegate_transaction.raw: ",
        result.data.create_stake_account_transaction.raw
      );

      // Retain these values in appState so they can be confirmed by decoding the payload
      setAppState({
        flowResponse: result,
        unsignedTransactionPayload:
          result.data.create_stake_account_transaction.raw,
        sol_createStakeAccountAmount: result.data.amount,
        sol_fundingAccountPubkey: result.data.funding_account_pubkey,
      });
    }

    // Alert user if there are validation errors
    if (result?.code === "invalid") {
      setAppState({ errorResponse: result, errorResponseTimestamp: date });
    }

    // Alert user if there is a transition error
    if (result?.code === "transition_error") {
      setAppState({
        transitionErrorResponse: result,
        errorResponseTimestamp: date,
      });
    }
  };

  const handleClearFormData = async () => {
    setFormData(undefined);
    setInputsSent(false);
  };

  async function handleFormChange(event) {
    setSelectedAction(event.target.value);
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // These code snippets are shown inside the Details modal to
  // demonstrate how an input form can be mapped from the Staking API response
  const codeSnippet = `<form
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

  const codeSnippetSubmit = `const handleSubmit = async (event) => {
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

  const title = "Submit Data to the Staking API (SOL)";

  return (
    <>
      <Head title={title} description={DESCRIPTION} />
      <BreadCrumbs step={2} />

      <LayoutColumn title={<Title>{title}</Title>}>
        <LayoutColumn.Column
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
            <p>
              <details>
                <summary>Click to view the full response</summary>
                <Formatted block maxHeight="510px">
                  {JSON.stringify(responseData, null, 2)}
                </Formatted>
              </details>
            </p>
            <p>
              <Button small onClick={handleCreateDelegateTx}>
                Create tx
              </Button>
            </p>

            {flowState === "delegation_activating" && (
              <>
                <p>
                  The flow state is now <Formatted>{flowState}</Formatted>, ...
                </p>
              </>
            )}

            <Button secondary small onClick={() => showModal()}>
              Click Here For More Information
            </Button>
          </Card>
        </LayoutColumn.Column>

        <LayoutColumn.Column>
          {!sol_accountPublicKey ? (
            <>
              <Card small>
                <p style={{ textAlign: "center" }}>
                  Please create an account first!
                </p>
                <Button href="/create-solana-account">
                  Create a Solana devnet account
                </Button>
              </Card>
            </>
          ) : (
            <>
              {flowState === "stake_account" && (
                <>
                  <Card small>
                    <p>
                      Stake account:{" "}
                      <b>{flowResponse.data.stake_account_pubkey}</b>
                    </p>
                    <p>
                      <form onSubmit={handleSubmitDelegate} method="post">
                        <label htmlFor="actions">Action(s):</label>
                        <select
                          id="actions"
                          name="actions"
                          required
                          defaultValue={flowActions[1]}
                          multiple={false}
                          key="actions"
                          onChange={handleFormChange}
                        >
                          {Object.keys(flowActions).map((key) => (
                            <>
                              <option
                                key={flowActions[key]}
                                value={flowActions[key]}
                                defaultValue={flowActions[1]}
                              >
                                {flowActions[key]}
                              </option>
                            </>
                          ))}
                        </select>
                        {selectedAction === "create_delegate_tx" && (
                          <>
                            {action0Inputs.map(({ name, display }, index) => {
                              return (
                                <span key={name}>
                                  <label htmlFor={name}>{display}:</label>
                                  <input
                                    key={`${name}${index}`}
                                    type="text"
                                    id={name}
                                    name={name}
                                    defaultValue={defaultValues[name]}
                                  />
                                </span>
                              );
                            })}
                          </>
                        )}
                        <Button disabled={formData}>
                          Create Inputs Payload
                        </Button>
                      </form>
                    </p>
                  </Card>
                </>
              )}
            </>
          )}
        </LayoutColumn.Column>

        <LayoutColumn.Column>
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
                to continue a flow in the state{" "}
                <Formatted>stake_account</Formatted>.
              </p>

              <Formatted block>{JSON.stringify(formData, null, 2)}</Formatted>

              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <Button
                  disabled={isLoading}
                  secondary
                  onClick={() => handleClearFormData()}
                >
                  Reset Inputs Payload
                </Button>
                {flowState !== "stake_account" ? (
                  <ToolTip
                    color="#C01005"
                    title={`Flow state is not stake_account`}
                  >
                    <Button
                      disabled={
                        isLoading ||
                        flowResponse.state === "delegate_tx_signature"
                      }
                      onClick={() => handleStakingAPI()}
                    >
                      Submit Data to Staking API
                    </Button>
                  </ToolTip>
                ) : (
                  <Button
                    disabled={isLoading}
                    onClick={() => handleStakingAPI()}
                  >
                    Submit Data to Staking API
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              <br />
              <br />
              {accountAddress && (
                <>
                  <p className="spacer">
                    Request body displayed here after clicking{" "}
                    <b>Create Inputs Payload</b>
                  </p>
                </>
              )}
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

          {!isLoading &&
            !unsignedTransactionPayload &&
            inputsSent &&
            transitionErrorResponse && (
              <>
                <Card small style={{ marginTop: "2rem" }}>
                  <Formatted block>
                    {JSON.stringify(transitionErrorResponse, null, 2)}
                  </Formatted>

                  <p className="callout">
                    <WarningOutlined /> A transition error occurs When the
                    action and inputs do not match what is expected by the
                    Staking API for the current flow state. <br />
                    <br />
                    This means that the action{" "}
                    <Formatted>{formData.action}</Formatted> cannot be performed
                    on the flow ID <Formatted>{flowId}</Formatted> in its
                    current state of
                    <br />
                    <Formatted>{flowState}</Formatted>.
                  </p>

                  <details>
                    <summary>Flow details</summary>
                    <ToolTip
                      placement="left"
                      title={`Data was submitted to /api/v1/flows/${flowId} at ${errorResponseTimestamp} - a transition error means that the submitted data could not be processed by the Staking API while the flow is in its current state.`}
                    >
                      <ul>
                        <li>
                          Flow state: <Formatted>{flowState}</Formatted>
                        </li>
                        <li>
                          <Formatted>action</Formatted> and{" "}
                          <Formatted>inputs</Formatted> submitted to the Staking
                          API:{" "}
                          <Formatted block>
                            {JSON.stringify(formData, null, 2)}
                          </Formatted>
                          <Formatted block>
                            {JSON.stringify(flowResponse, null, 2)}
                          </Formatted>
                        </li>
                      </ul>
                    </ToolTip>
                  </details>
                </Card>
              </>
            )}

          {!isLoading &&
            !unsignedTransactionPayload &&
            inputsSent &&
            errorResponse &&
            !transitionErrorResponse && (
              <>
                <Card small style={{ marginTop: "2rem" }}>
                  <ToolTip
                    placement="left"
                    title={`Data was submitted to /api/v1/flows/${flowId} at ${errorResponseTimestamp} - the presence of validation errors does not mean that the inputs were incorrect.`}
                  >
                    <p className="callout">
                      <b>
                        <WarningOutlined /> Validation error(s) occurred when
                        submitting this data to the Staking API.
                      </b>
                      <br />
                      <br />
                      Default values supplied by this app should not cause
                      validation errors under normal circumstances. If the
                      inputs you sent are known to be valid, this could indicate
                      an issue with Solana devnet nodes used by the Staking API.
                      <br />
                      <br />
                      <LinkOutlined />{" "}
                      <Link
                        // ${formData.inputs.funding_account_pubkey}
                        href={solscanUrl(
                          "address",
                          formData.inputs.funding_account_pubkey,
                          "devnet"
                        )}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Check Funding Account Address
                      </Link>
                      <br />
                      <br />
                      If the inputs are correct, please contact Figment
                      Technical Support via email:{" "}
                      <Link href="mailto:technical.support@figment.io?subject=Visualize%20Flows%20Validation%20Errors%20Solana&body=Hello%2C%0D%0A%0D%0AWhile%20using%20the%20Visualize%20Staking%20API%20Flows%20app%20from%20Figment%2C%20I%20encountered%20validation%20errors%20while%20attempting%20to%20create%20a%20delegate%20transaction.%0D%0A%0D%0A----%0D%0APlease%20include%20any%20other%20information%20regarding%20your%20use%20of%20the%20Visualize%20Flows%20app%20that%20you%20would%20like%20to%20pass%20along%20to%20Figment%20Technical%20Support%20below%3A">
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
            <>
              <br />
              <Card small>
                <p>
                  Completing the <Formatted>create_delegate_tx</Formatted>{" "}
                  action causes the flow state to change from{" "}
                  <Formatted>stake_account</Formatted> to{" "}
                  <Formatted>delegate_tx_signature</Formatted>, indicating that
                  the Staking API is waiting for a signed transaction. The{" "}
                  <Formatted>actions</Formatted> for this step are{" "}
                  <Formatted>{flowResponse?.actions[0].name}</Formatted> and{" "}
                  <Formatted>{flowResponse?.actions[1].name}</Formatted>.
                  <br />
                  <br />
                  We&apos;ll handle the signing below.
                </p>
                <details>
                  <summary>Click here to see the full response</summary>
                  <Formatted block maxHeight="510px">
                    {JSON.stringify(flowResponse, null, 2)}
                  </Formatted>{" "}
                </details>

                <p>
                  Another unsigned{" "}
                  <ToolTip
                    style={{ textDecoration: "underline" }}
                    placement="top"
                    title={`In terms of the Staking API, a transaction payload is just a hashed representation of the inputs belonging to an action.`}
                  >
                    transaction payload
                  </ToolTip>{" "}
                  has been created by the Staking API from the submitted{" "}
                  <Formatted>action</Formatted> and{" "}
                  <Formatted>inputs</Formatted>.
                </p>

                <details>
                  <summary>Click here to see the payload</summary>
                  <Formatted block>{unsignedTransactionPayload}</Formatted>{" "}
                </details>

                <p>
                  We won&apos;t cover the details of signing the payload this
                  time, just click the button below to sign and broadcast the
                  transaction.
                </p>

                <Button
                  disabled={transactionBroadcast}
                  onClick={handleSignAndBroadcastPayload}
                >
                  {isLoading && <LoadingOutlined />}
                  Sign & Broadcast the Payload
                </Button>

                {transactionBroadcast && (
                  <>
                    <Button
                      onClick={() => setAppState({ stepCompleted: 6 })}
                      href={`/view-all-flows`}
                    >
                      Proceed to the final step &rarr;
                    </Button>
                  </>
                )}
              </Card>
            </>
          )}
        </LayoutColumn.Column>

        <Footer />
      </LayoutColumn>

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
            <Formatted>display</Formatted> labels which we have used to
            construct the form on this page. These values are always included in
            the Staking API response when a flow is created.
            <details>
              <summary>Click here to see the full Staking API response</summary>
              <ul>
                <li>Flow action(s):</li>
                <ul>
                  <li>
                    <b>{flowActions[0]}</b> comes from{" "}
                    <Formatted>actions[0].name</Formatted>
                  </li>
                  {flowActions[1] && (
                    <li>
                      <b>{flowActions[1]}</b> comes from{" "}
                      <Formatted>actions[1].name</Formatted>
                    </li>
                  )}
                  {flowActions[2] && (
                    <>
                      <b>{flowActions[2]}</b> comes from{" "}
                      <Formatted>actions[2].name</Formatted>
                    </>
                  )}
                  {flowActions[3] && (
                    <>
                      <b>{flowActions[3]}</b> comes from{" "}
                      <Formatted>actions[3].name</Formatted>
                    </>
                  )}
                  {flowActions[4] && (
                    <>
                      <b>{flowActions[4]}</b> comes from{" "}
                      <Formatted>actions[3].name</Formatted>
                    </>
                  )}
                  {flowActions[5] && (
                    <>
                      <b>{flowActions[5]}</b> comes from{" "}
                      <Formatted>actions[3].name</Formatted>
                    </>
                  )}
                  {flowActions[6] && (
                    <>
                      <b>{flowActions[6]}</b> comes from{" "}
                      <Formatted>actions[3].name</Formatted>
                    </>
                  )}
                </ul>
                <li>
                  Action inputs: <b>{flowInputs.join(", ")}</b> come from{" "}
                  <Formatted>actions[0].inputs[0].name</Formatted>,{" "}
                  <Formatted>actions[0].inputs[1].name</Formatted> etc.
                </li>
                <li>
                  Action display labels: <b>{flowLabels.join(", ")}</b> come
                  from <Formatted>actions[0].inputs[0].display</Formatted>,{" "}
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

              <Formatted block maxHeight="550px">
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

              <Formatted block maxHeight="450px">
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
