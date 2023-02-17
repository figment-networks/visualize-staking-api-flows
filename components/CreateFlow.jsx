// @ts-nocheck
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Modal } from "antd";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import "yet-another-react-lightbox/styles.css";

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

import img1 from "public/img/Workflows::V1::Solana::StakingFlow_workflow.png";

export default function CreateFlowSolana({ operation }) {
  const { appState, setAppState } = useAppState();
  const {
    flowId,
    flowResponse,
    flowActions,
    flowInputs,
    flowLabels,
    stepCompleted,
    accountAddress,
    accountPublicKey,
    accountPrivateKey,
    flowCompleted,
    action1Inputs,
    action0Inputs,
  } = appState;

  const [formData, setFormData] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState("");

  async function handleFormChange(event) {
    setSelectedNetwork(event.target.value);
  }

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // To facilitate generating the form labels and input fields
  // for data collection in the next step, create an array of
  // objects containing both the input names and labels:
  // { name: "delegator_address", label: "Delegator Address" }
  useEffect(() => {
    setSelectedNetwork("solana");

    if (!!appState.inputs.length) return; // Return early if the inputs are already defined
    const inputs = Array(flowInputs.length)
      .fill(null)
      .map((empty, index) => ({
        action: flowActions[index],
        name: flowInputs[index],
        label: flowLabels[index],
      }));

    setAppState({ ...appState, inputs: inputs });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowActions, flowResponse, flowInputs, flowLabels]);

  const handleSubmit = async (event) => {
    // preventDefault is part of the React event system
    // it is used to prevent the form from submitting
    // automatically and refreshing the page on load
    event.preventDefault();

    const form = event.target;

    // Get data from the form
    // The flow property is being added here, before
    // being passed to the server-side and Staking API
    // See the specification at:
    // https://docs.figment.io/api-reference/staking-api/near/#create%20new%20delegation%20flow
    const data = {
      flow: {
        network_code: form.network_code.value,
        chain_code: form.chain_code.value,
        operation: form.operation.value,
        version: form.version.value,
      },
    };

    // Set state variable so we can display the form data on the client side
    setFormData(data);
  };

  const handleClearFormData = async () => {
    setFormData(undefined);
  };

  const handleResetFlow = async () => {
    setAppState({
      accountAddress: accountAddress,
      accountPublicKey: accountPublicKey,
      accountPrivateKey: accountPrivateKey,
      action0Inputs: undefined,
      action1Inputs: undefined,
      createError: undefined,
      errorResponse: undefined,
      errorResponseTimestamp: undefined,
      transitionErrorResponse: undefined,
      stepCompleted: 0,
      flowActions: undefined,
      flowId: undefined,
      flowInputs: [],
      flowLabels: [],
      inputs: [],
      flowCompleted: false,
      flowResponse: undefined,
      flowResponseDelegate: undefined,
      responseData: undefined,
      flowState: undefined,
      pageItem: [],
      decodedTransactionPayload: undefined,
      unsignedTransactionPayload: undefined,
      signedTransactionPayload: undefined,
      validatorAddress: undefined,
      delegateAmount: undefined,
    });
    setFormData(undefined);
    alert(
      `Reset flowId!\n` +
        `Refer to /view-all-flows for details of flow ${flowId}.`
    );
  };

  const handleCreateFlow = async (event) => {
    try {
      const response = await fetch(`/api/${operation}/create-flow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      function getInputsForAction(action) {
        return action.inputs.flatMap((input) => [
          {
            name: input.name,
            display: input.display,
          },
        ]);
      }

      const isErrorFree = !result.message;
      const hasData = result.id && result.state && result.actions;
      if (isErrorFree && hasData) {
        setAppState({
          flowResponse: result,
          flowId: result.id,
          flowState: result.state,
          flowActions: result.actions.map((action) => action.name),
          flowInputs: result.actions.flatMap((action) =>
            getInputsForAction(action)
          ),
          flowLabels: result.actions.flatMap((action) =>
            action.inputs.map((input) => input.display)
          ),
          action0Inputs: getInputsForAction(result.actions[0]),
          action1Inputs: getInputsForAction(result.actions[1]),
        });
      }

      if (result?.message === "No API key found in request") {
        Error.stackTraceLimit = 0; // Prevent stack trace
        throw new Error(
          `${result?.message} - Please add a valid Figment API key ` +
            `to .env, then restart the Next.js Development server to continue`
        );
      } else {
        console.log(JSON.stringify(result, null, 2));
      }
    } catch (error) {
      // Log error and alert the user
      console.log(error);
      alert(error);
    }
  };

  const title = "Create a Flow";

  return (
    <>
      <Head title={title} description={DESCRIPTION} />
      <BreadCrumbs step={1} network="solana" />

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
              Figment&apos;s Staking API operates with the concept of flows.
              When creating a new flow, you must provide the{" "}
              <Formatted>network</Formatted>, <Formatted>chain_code</Formatted>,{" "}
              <Formatted>operation</Formatted> and Staking API{" "}
              <Formatted>version</Formatted>.
            </p>
            <p>
              Each flow is given a unique ID, which is referenced when
              continuing that flow or querying its details. The form below
              creates a JSON request body, which you can send to the Staking API
              to create a new flow.
            </p>
            <ToolTip
              title={`Click here to view the flow diagram for this type of flow in a scrollable, zoomable lightbox. Click and drag to scroll, CTRL + Scrollwheel to zoom. Press ESC to close the lightbox.`}
            >
              <Button small onClick={() => setLightboxOpen(true)}>
                View Flow Diagram in Lightbox
              </Button>
            </ToolTip>
            <br />

            <Button secondary type="text" onClick={() => showModal()}>
              Click Here For More Information
            </Button>

            <Lightbox
              open={lightboxOpen}
              close={() => setLightboxOpen(false)}
              slides={[img1]}
              plugins={[Zoom]}
            />
          </Card>
        </LayoutColumn.Column>

        <LayoutColumn.Column style={{ marginBottom: "2.4rem" }}>
          {flowCompleted ? (
            <Card small>
              <p className="callout">
                A previously completed flow <b>{flowId}</b> exists. Please{" "}
                <b>reset the flow</b> to continue.
              </p>
              <Button
                destructive
                onClick={() => handleResetFlow()}
                style={{ display: "block", margin: "0 auto" }}
              >
                Reset Flow
              </Button>
            </Card>
          ) : (
            <>
              <Card large>
                <p>
                  Click <b>Create JSON Request Body</b> to continue.
                </p>
                <form onSubmit={handleSubmit} method="post">
                  <label htmlFor="network_code">Network</label>
                  <select
                    id="network_code"
                    name="networkCode"
                    required
                    defaultValue="solana"
                    onChange={handleFormChange}
                  >
                    <option disabled value="avalanche">
                      Avalanche
                    </option>
                    <option disabled value="cosmos">
                      Cosmos
                    </option>
                    <option disabled value="ethereum">
                      Ethereum
                    </option>
                    <option disabled value="near">
                      NEAR
                    </option>
                    <option disabled value="polkadot">
                      Polkadot
                    </option>
                    <option disabled value="polygon">
                      Polygon
                    </option>
                    <option value="solana">Solana</option>
                  </select>

                  <label htmlFor="chain_code">Chain Code</label>
                  <select id="chain_code" name="chainCode" required>
                    <option disabled value="mainnet">
                      Mainnet
                    </option>
                    {selectedNetwork === "polkadot" ? (
                      <option value="westend">Westend</option>
                    ) : (
                      <option disabled value="testnet">
                        Testnet
                      </option>
                    )}
                    {selectedNetwork === "solana" ? (
                      <option value="devnet">Devnet</option>
                    ) : (
                      ""
                    )}
                  </select>

                  {/* Networks support different operations, 
                      so we are using conditional rendering 
                      to make the form dynamic. */}
                  <label htmlFor="operation">Operation</label>
                  <select
                    id="operation"
                    name="operation"
                    required
                    defaultValue="staking"
                  >
                    <option value="staking">Staking</option>
                    {selectedNetwork === "solana" ||
                    selectedNetwork === "near" ||
                    selectedNetwork === "polkadot" ||
                    selectedNetwork === "polygon" ||
                    !selectedNetwork ? (
                      <option value="unstaking" disabled>
                        Unstaking
                      </option>
                    ) : (
                      ""
                    )}
                    {selectedNetwork === "solana" ||
                    selectedNetwork === "near" ||
                    selectedNetwork === "polkadot" ||
                    selectedNetwork === "cosmos" ||
                    !selectedNetwork ? (
                      <option value="transfer" disabled>
                        Transfer
                      </option>
                    ) : (
                      ""
                    )}
                    {selectedNetwork === "polkadot" ? (
                      <>
                        <option value="add_proxy">Add Proxy</option>
                        <option value="remove_proxy">Remove Proxy</option>
                      </>
                    ) : (
                      ""
                    )}
                    {selectedNetwork === "polygon" ? (
                      <option value="claim_rewards">Claim Rewards</option>
                    ) : (
                      ""
                    )}
                    {selectedNetwork === "solana" ? (
                      <option disabled value="split_stake_account">
                        Split Stake Account
                      </option>
                    ) : (
                      ""
                    )}
                  </select>

                  <label htmlFor="version">Version</label>
                  <select
                    id="version"
                    name="version"
                    required
                    defaultValue="v1"
                  >
                    <option value="v1">v1</option>
                  </select>

                  {/* Submitting this form does not fetch from the Staking API,
                  it only populates the display of the JSON payload. */}

                  <br />
                  <br />
                  <Button disabled={formData}>Create JSON Request Body</Button>
                </form>
              </Card>
            </>
          )}
        </LayoutColumn.Column>

        <LayoutColumn.Column style={{ marginBottom: "2.4rem" }}>
          {!flowCompleted && flowResponse ? (
            <>
              <Card small>
                <p>
                  Flow ID{" "}
                  <Formatted dark>
                    <ToolTip
                      style={{
                        textDecoration: "underline dotted",
                        cursor: "help",
                      }}
                      placement="topLeft"
                      title={`This is the flow's unique ID, which can be used to continue the flow or to query the API for the current details of the flow.`}
                    >
                      {flowResponse?.id}
                    </ToolTip>
                  </Formatted>{" "}
                  state is{" "}
                  <Formatted>
                    <ToolTip
                      style={{
                        textDecoration: "underline dotted",
                        cursor: "help",
                      }}
                      placement="top"
                      title={`This is the flow's current state. The flow will remain in the initialized state until it is updated by an action.`}
                    >
                      {flowResponse?.state}
                    </ToolTip>
                  </Formatted>
                  .
                </p>

                <p>
                  After creating a flow, the next step is to check the response
                  to understand which actions are available, and which input
                  data must be provided to continue the flow.
                </p>

                <p>
                  The actions available at this point in the flow are:{" "}
                  <Formatted>{flowResponse?.actions[0]?.name}</Formatted> and{" "}
                  <Formatted>{flowResponse?.actions[1]?.name}</Formatted>.
                </p>
                <ul>
                  <li>
                    <p>
                      Use the <Formatted>create_new_stake_account</Formatted>{" "}
                      action to create a stake account and assign it a balance.
                      The inputs for this action are{" "}
                      <Formatted>{action1Inputs[0].name}</Formatted>,{" "}
                      <Formatted>{action1Inputs[1].name}</Formatted>,{" "}
                      <Formatted>{action1Inputs[2].name}</Formatted>,{" "}
                      <Formatted>{action1Inputs[3].name}</Formatted>.
                    </p>
                  </li>

                  <li>
                    <p>
                      If you already have a stake account prepared (on Devnet),
                      you can use the{" "}
                      <Formatted>assign_stake_account</Formatted> action. The
                      inputs for this action are{" "}
                      <Formatted>{action0Inputs[0].name}</Formatted> and{" "}
                      <Formatted>{action0Inputs[1].name}</Formatted>.{" "}
                    </p>
                  </li>
                </ul>

                <details>
                  <summary>Click to view the full Staking API response</summary>
                  <Formatted block maxHeight="500px">
                    {JSON.stringify(flowResponse, null, 2)}
                  </Formatted>
                </details>
                <Button
                  style={{ display: "block", margin: "0 auto" }}
                  href={`/operations/staking/submit-data`}
                  onClick={() => setAppState({ stepCompleted: 1 })}
                >
                  Proceed to the next step &rarr;
                </Button>
                {/* <br />
                <Button
                  destructive
                  onClick={() => handleResetFlow()}
                  style={{ display: "block", margin: "0 auto" }}
                >
                  Reset Flow
                </Button> */}
              </Card>
            </>
          ) : (
            <>
              {!flowCompleted && !formData && (
                <>
                  <br />
                  <p className="spacer">
                    The request body will be displayed when you click{" "}
                    <b>Create JSON Request Body</b>.
                  </p>
                </>
              )}

              {formData && !flowResponse && (
                <>
                  <p>
                    Send this JSON request body to the{" "}
                    <ToolTip
                      title={`POST /api/v1/flows - Refer to the Figment Docs for more information.`}
                      style={{
                        textDecoration: "underline dotted",
                        cursor: "help",
                      }}
                    >
                      Staking API endpoint
                    </ToolTip>{" "}
                    to create a new flow:
                  </p>
                  <Formatted block>
                    {JSON.stringify(formData, null, 2)}
                  </Formatted>
                  <br />
                  <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    <Button secondary onClick={() => handleClearFormData()}>
                      Clear JSON Request Body
                    </Button>
                    <Button onClick={() => handleCreateFlow()}>
                      Create Staking API Flow
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </LayoutColumn.Column>
      </LayoutColumn>

      <Footer />

      <Modal
        title="Details"
        width="calc(50% - 10px)"
        footer={null}
        open={isModalOpen}
        onCancel={closeModal}
      >
        <ul>
          <p>
            <b>Note</b>: To provide a seamless experience, this app is currently
            limited to the staking flow on Solana Devnet.
          </p>
          <br />
          <li>
            Figment&apos;s Staking API supports several networks, each network
            has its own set of available operations. Upon creation, each flow is
            given a unique ID. Flows can be created on devnet, testnet or
            mainnet.
            <br />
            Flows change state when an action has been completed.
            <br />
            Flow actions relate to each part of an operation &mdash; for
            example, a <Formatted>staking</Formatted> operation has the actions
            <br />
            <Formatted>create_delegate_tx</Formatted>,{" "}
            <Formatted>refresh_delegate_tx</Formatted> and{" "}
            <Formatted>sign_delegate_tx</Formatted>.
          </li>
          <br />
          <li>
            The most common operations for the Staking API are{" "}
            <Formatted>staking</Formatted>, <Formatted>unstaking</Formatted> and{" "}
            <Formatted>transfer</Formatted>.
            <br />
            The full list of supported networks and operations is available in
            the{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.figment.io/guides/staking-api/figment-signing-transactions#operations-and-transaction-types"
            >
              Figment Docs
            </Link>
          </li>
          <br />
          <li>
            The Figment Docs also have{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.figment.io/guides/staking-api/solana/delegate/create-new-flow"
            >
              specific guides
            </Link>{" "}
            for each network and operation supported by the Staking API!
          </li>
          <br />
          <li>
            If you&apos;re just interested in the specification, check out the
            API Reference{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.figment.io/api-reference/staking-api/solana#create%20new%20delegation%20flow"
            >
              Create New Delegation Flow on Solana
            </Link>{" "}
            for sample request and response data.
          </li>
          <br />
          <h5>Network specific operations:</h5>
          <li>
            Avalanche and Ethereum <b>do not</b> have an{" "}
            <Formatted>unstaking</Formatted> operation.
            <br /> For Avalanche, this is due to how delegations are handled by
            the network.
            <br />
            <b>Note</b>:{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://ethereum.org/en/upgrades/merge/#merge-and-shanghai"
            >
              Unstaking on Ethereum
            </Link>{" "}
            will become possible in the future, after the Shanghai/Capella
            upgrade.
            <br />
            Please refer to the{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href=" https://notes.ethereum.org/@launchpad/withdrawals-faq#Q-What-is-ShanghaiCapella"
            >
              Ethereum Withdrawals FAQ
            </Link>{" "}
            for more information.
          </li>
          <br />
          <li>
            Polkadot has <Formatted>add_proxy</Formatted> and{" "}
            <Formatted>remove_proxy</Formatted> operations, which are useful for
            managing staking nominations.
          </li>
          <br />
          <li>
            Solana has <Formatted>split_stake_account</Formatted> and{" "}
            <Formatted>merge_stake_account</Formatted> operations, which are
            useful when managing stake account balances.
          </li>
          <br />
          <h5>Network specific chain codes:</h5>
          <li>
            <b>All</b> networks support operations on <b>mainnet</b> (
            <Formatted>chain_code</Formatted> = <Formatted>mainnet</Formatted>).
          </li>
          <br />
          <li>
            Polkadot&apos;s <b>testnet</b> is called Westend (
            <Formatted>chain_code</Formatted> = <Formatted>westend</Formatted>).
          </li>
          <br />
          <li>
            Solana has both a <b>testnet</b> (<Formatted>chain_code</Formatted>{" "}
            = <Formatted>testnet</Formatted>) and a <b>devnet</b>, (
            <Formatted>chain_code</Formatted> = <Formatted>devnet</Formatted>).
          </li>
          <br />
        </ul>
      </Modal>
    </>
  );
}
