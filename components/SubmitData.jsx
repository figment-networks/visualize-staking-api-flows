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
  trimmedSolanaAccount,
} from "@components/ui-components";

import { useAppState } from "@utilities/appState";

const solscanUrl = (op, address, cluster) =>
  `https://solscan.io/${op}/${address}?cluster=${cluster}`;

export default function SubmitSolanaData({ operation }) {
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
  } = appState;

  const [isLoading, setIsLoading] = useState(false);
  const [inputsSent, setInputsSent] = useState(false);
  const [formData, setFormData] = useState();
  const [selectedAction, setSelectedAction] = useState(
    "create_new_stake_account"
  );

  // Default values for the input collection form of a `staking` flow operation
  const defaultAssignValues = {
    funding_account_pubkey: sol_accountPublicKey
      ? sol_accountPublicKey
      : "Please create an account first!",
  };

  const defaultValuesNewStakingAccount = {
    funding_account_pubkey: sol_accountPublicKey
      ? sol_accountPublicKey
      : "Please generate an account first!",
    stake_authority_pubkey: null,
    withdraw_authority_pubkey: null,
    amount: 1.5,
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

    if (flowState !== "initialized") {
      alert(
        `Flow state is not initialized - create_delegate_tx will fail with a transition error.`
      );
    }

    setIsLoading(true);

    const response = await fetch(`/api/staking/submit-data`, {
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

  const title = "Submit Data to the Staking API";

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
          <Card medium>
            <p>
              The action <Formatted>create_new_stake_account</Formatted> has two
              required inputs: <Formatted>funding_account_pubkey</Formatted> &{" "}
              <Formatted>amount</Formatted>. There are also two <i>optional</i>{" "}
              inputs: <Formatted>stake_authority_pubkey</Formatted> and{" "}
              <Formatted>withdraw_authority_pubkey</Formatted>, which will
              default to the <Formatted>funding_account_pubkey</Formatted> if no
              addresses are specified.
            </p>
            <p>
              The form below has been created based on the Staking API response
              and provided with default values:
            </p>
            <ul>
              <li>
                <Formatted>funding_account_pubkey</Formatted> defaults to the
                Public Key of the Solana Devnet account created by this app
                &rarr; {trimmedSolanaAccount(sol_accountPublicKey)}.
              </li>
              <li>
                <Formatted>amount</Formatted> defaults to{" "}
                <Formatted>1.5</Formatted>. The <i>minimum</i> amount for a
                stake account is 1 SOL.
              </li>
            </ul>

            {!sol_accountPublicKey && (
              <>
                <p className="center">Please create an account first!</p>
                <Button href="/create-solana-account">
                  Create a Solana Devnet account
                </Button>
              </>
            )}

            {sol_accountPublicKey && stepCompleted >= 1 && (
              <Button secondary small onClick={() => showModal()}>
                Click Here For More Information
              </Button>
            )}
          </Card>
        </LayoutColumn.Column>

        <LayoutColumn.Column>
          {sol_accountPublicKey && (
            <>
              <Card small>
                <p>
                  Please review the inputs below, then click{" "}
                  <b>Create Inputs Payload</b> to continue.
                </p>
                <form onSubmit={handleSubmit} method="post">
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

                  {selectedAction === "assign_stake_account" && (
                    <>
                      {action0Inputs.map(({ name, display }, index) => {
                        return (
                          <span key={name + "!"}>
                            <label htmlFor={name}>{display}:</label>
                            <input
                              key={`${name}${index}`}
                              type="text"
                              id={name}
                              name={name}
                              defaultValue={defaultAssignValues[name]}
                            />
                          </span>
                        );
                      })}
                    </>
                  )}

                  {selectedAction === "create_new_stake_account" && (
                    <>
                      {action1Inputs.map(({ name, display }, index) => {
                        return (
                          <>
                            <span key={name}>
                              <label htmlFor={name}>{display}:</label>
                              <input
                                key={name}
                                type="text"
                                id={name}
                                name={name}
                                defaultValue={
                                  defaultValuesNewStakingAccount[name]
                                }
                              />
                            </span>
                          </>
                        );
                      })}
                    </>
                  )}
                  <Button disabled={formData} style={{ marginTop: "20px" }}>
                    Create Inputs Payload
                  </Button>
                </form>
              </Card>
            </>
          )}
        </LayoutColumn.Column>

        <LayoutColumn.Column>
          {formData ? (
            <>
              <p>
                Send this JSON request body to the{" "}
                <ToolTip
                  style={{ textDecoration: "underline dotted", cursor: "help" }}
                  placement="top"
                  title={`PUT /api/v1/flows/<flow_id>/next - Refer to the Figment Docs for more information.`}
                >
                  Staking API endpoint
                </ToolTip>{" "}
                to continue an <Formatted>initialized</Formatted> flow.
              </p>

              <Formatted block>{JSON.stringify(formData, null, 2)}</Formatted>

              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <Button
                  style={{ marginTop: "20px" }}
                  disabled={
                    isLoading || flowResponse.state === "delegate_tx_signature"
                  }
                  secondary
                  onClick={() => handleClearFormData()}
                >
                  Reset Inputs Payload
                </Button>
                {flowState !== "initialized" || stepCompleted >= 2 ? (
                  <ToolTip
                    color="#C01005"
                    title={`Flow state is not initialized`}
                  >
                    <Button
                      style={{ marginTop: "20px" }}
                      disabled={
                        isLoading ||
                        stepCompleted >= 2 ||
                        flowResponse.state === "delegate_tx_signature"
                      }
                      onClick={() => handleStakingAPI()}
                    >
                      Submit Data to Staking API
                    </Button>
                  </ToolTip>
                ) : (
                  <Button
                    style={{ marginTop: "20px" }}
                    disabled={
                      isLoading ||
                      flowResponse.state === "stake_account_tx_signature"
                    }
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
              {sol_accountPublicKey && (
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

          {unsignedTransactionPayload && inputsSent && (
            <>
              <br />
              <Card small>
                <p>
                  Completing the <Formatted>create_new_stake_account</Formatted>{" "}
                  action causes the flow state to change from{" "}
                  <Formatted>initialized</Formatted> to{" "}
                  <Formatted>stake_account_tx_signature</Formatted>, indicating
                  that the Staking API is waiting for a signed transaction.
                </p>
                <p>
                  The available actions at this point in the flow are{" "}
                  <Formatted>{flowResponse.actions[0].name}</Formatted>,{" "}
                  <Formatted>{flowResponse.actions[1].name}</Formatted> and{" "}
                  <Formatted>{flowResponse.actions[2].name}</Formatted>.
                </p>
                <p></p>
                <details>
                  <summary>Click here to see the full response</summary>
                  <Formatted block maxHeight="510px">
                    {JSON.stringify(flowResponse, null, 2)}
                  </Formatted>{" "}
                </details>
                <p>
                  An unsigned{" "}
                  <ToolTip
                    style={{
                      textDecoration: "underline dotted",
                      cursor: "help",
                    }}
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
                  In the next step, we will examine decoding the payload to
                  verify its contents, then signing it using a private key.
                </p>
                <Button
                  onClick={() => setAppState({ stepCompleted: 2 })}
                  href={`/operations/staking/sign-payload`}
                >
                  Proceed to the next step &rarr;
                </Button>
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
        <ul style={{ marginLeft: "20px" }}>
          <li>
            The flow provides <Formatted>actions</Formatted>
            {" & "}
            <Formatted>inputs</Formatted> names and{" "}
            <Formatted>display</Formatted> labels which we have been used to
            construct the form on this page. These values are always included in
            the Staking API response when a flow is created.
            <details>
              <summary>Click here to see the full Staking API response</summary>
              <ul>
                <li>Flow action(s):</li>
                <b>
                  {flowResponse?.actions?.map(({ name, display }, index) => {
                    return name + ", ";
                  })}
                </b>{" "}
                come from <Formatted>actions[0].name</Formatted>,{" "}
                <Formatted>actions[1].name</Formatted>, etc
                <li>Action inputs:</li>
                <b>
                  {flowInputs.map(({ name, display }, index) => {
                    return name + ", ";
                  })}
                </b>{" "}
                come from <Formatted>actions[0].inputs[0].name</Formatted>,{" "}
                <Formatted>actions[0].inputs[1].name</Formatted> or{" "}
                <Formatted>actions[1].inputs[0].name</Formatted> etc.
                <li>Action display labels:</li>
                <b>
                  {flowInputs.map(({ name, display }, index) => {
                    return display + ", ";
                  })}
                </b>{" "}
                come from <Formatted>actions[0].inputs[0].display</Formatted>,{" "}
                <Formatted>actions[0].inputs[1].display</Formatted> or{" "}
                <Formatted>actions[1].inputs[0].display</Formatted> etc.
              </ul>
              <Formatted block maxHeight="320px">
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
              href="https://docs.figment.io/guides/staking-api/solana/delegate/submit-delegate-data"
            >
              network-specific Guides
            </Link>{" "}
            on the Figment Docs.
          </li>
          <br />
          <li>
            <b>Note</b>: Solana Devnet accounts are <i>not</i> automatically
            supplied with any SOL tokens upon creation.
            <br />
            As a convenience, accounts created by this app are airdropped 2 SOL.
            Additional airdrops can be requested on the <b>
              Create Account
            </b>{" "}
            page (accessible at any time by clicking <b>Create Account</b> at
            the top left of the page).
            <br />
            Airdrops of up to 2 SOL can be requested at any time on Devnet,
            however the <Formatted>requestAirdrop</Formatted> method is heavily
            rate limited on public Solana RPC endpoints to prevent botting. In
            practice, this means that you should wait approximately 30 seconds
            between airdrop requests to avoid a failed transaction.
          </li>
          <br />

          <h6>&darr; Default Values for creating a stake account</h6>
          <br />
          <li>
            The <b>Funding Account Pubkey</b> pays the transaction fees and also
            supplies the stake account with the <b>Amount</b>. We&apos;ll use
            the account generated by this app as a default.
            <ul>
              <li style={{ marginLeft: "20px" }}>
                Funding Account Pubkey: <b>{sol_accountPublicKey}</b>
              </li>
            </ul>
          </li>
          <br />

          <li>
            The <b>Stake Authority Pubkey</b> is <i>optional</i>.
            <ul>
              <li style={{ marginLeft: "20px" }}>
                If no address is specified, this will default to the same
                address as the Funding Account Pubkey.
              </li>
            </ul>
          </li>
          <br />

          <li>
            The <b>Withdraw Authority Pubkey</b> is <i>optional</i>.
            <ul>
              <li style={{ marginLeft: "20px" }}>
                If no address is specified, this will default to the same
                address as the Funding Account Pubkey.
              </li>
            </ul>
          </li>
          <br />

          <li>
            The minimum <b>Amount</b> that can be assigned to a stake account is
            1 SOL.
            <ul>
              <li style={{ marginLeft: "20px" }}>
                Amount: <b>1.5</b>
              </li>
            </ul>
          </li>
          <br />
        </ul>
      </Modal>
    </>
  );
}
