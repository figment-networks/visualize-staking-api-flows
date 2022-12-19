// @ts-nocheck
import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button, Modal, ConfigProvider } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import { useAppState } from "@utilities/appState";

import styles from "@styles/Home.module.css";

export default function InitializeFlow({ operation }) {
  const { appState, setAppState } = useAppState();
  const [formData, setFormData] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState("");

  const { flowId, flowResponse, flowInputs, flowLabels, stepCompleted } =
    appState;

  async function handleFormChange(event) {
    setSelectedNetwork(event.target.value);
  }

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleInitializeFlow = async (event) => {
    try {
      const response = await fetch(`/api/${operation}/initialize-flow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      const isErrorFree = !result.message;
      const hasData = result.id && result.state && result.actions;
      if (isErrorFree && hasData) {
        setAppState({
          ...appState,
          flowResponse: result,
          flowId: result.id,
          flowState: result.state,
          flowActions: result.actions.map((action) => action.name),
          flowInputs: result.actions.flatMap((action) =>
            action.inputs.map((input) => input.name)
          ),
          flowLabels: result.actions.flatMap((action) =>
            action.inputs.map((input) => input.display)
          ),
        });
      }

      if (result?.message === "No API key found in request") {
        Error.stackTraceLimit = 0; // Prevent stack trace
        throw new Error(
          `${result?.message} - Please add a valid Figment API key to .env, then restart the Next.js Development server to continue`
        );
      } else {
        console.log(result);
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  // To facilitate generating the form labels and input fields
  // for data collection in the next step, create an array of
  // objects containing both:
  // { name: "delegator_address", label: "Delegator Address" }
  useEffect(() => {
    if (!!appState.inputs.length) return;

    const inputs = Array(flowInputs.length)
      .fill(null)
      .map((empty, index) => ({
        name: flowInputs[index],
        label: flowLabels[index],
      }));

    setAppState({ inputs: inputs });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowResponse, flowInputs, flowLabels]);

  const handleSubmit = async (event) => {
    // preventDefault is part of the React event system
    // it is used to prevent the form from submitting
    // automatically and refreshing the page on load
    event.preventDefault();

    const form = event.target;

    // Get data from the form
    const data = {
      network_code: form.network_code.value,
      chain_code: form.chain_code.value,
      operation: form.operation.value,
      version: form.version.value,
    };

    // Set state so we can display the data
    setFormData(data);
  };

  const handleClearFormData = async () => {
    setFormData(undefined);
  };

  const handleReset = async () => {
    setAppState({ flowResponse: undefined });
    setFormData(undefined);
    alert(
      `Reset request body and current flowId!\n` +
        `Flow ${flowId} is still initialized.\n` +
        `Refer to /view-all-flows at the end of the walkthrough for details.`
    );
  };

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
          <Modal
            title="Details"
            width="45%"
            footer={null}
            open={isModalOpen}
            onCancel={handleCancel}
          >
            <ul>
              <li>
                The most common operations are <code>staking</code>,{" "}
                <code>unstaking</code> and <code>transfer</code>.
              </li>
              <br />
              <li>
                Find the full list of supported networks and operations in the{" "}
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://docs.figment.io/guides/staking-api/figment-signing-transactions#operations-and-transaction-types"
                >
                  Staking API Guides
                </Link>
              </li>
              <br />
              <li>
                Avalanche, Cosmos and Ethereum <b>do not</b> have an{" "}
                <code>unstaking</code> operation.
                <br /> For Avalanche and Cosmos, this is due to how delegations
                are handled on those networks.
                <br />
                <b>Note</b>:{" "}
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://ethereum.org/en/upgrades/merge/#merge-and-shanghai"
                >
                  Unstaking on Ethereum
                </Link>{" "}
                will become possible in the future, after the Shanghai upgrade.
              </li>
              <br />
              <li>
                Polkadot has <code>add_proxy</code> and{" "}
                <code>remove_proxy</code> operations, which are useful for
                managing staking nominations.
              </li>
              <br />
              <li>
                Solana has a <code>split_stake_account</code> operation, which
                is useful when a user wants to break a stake account balance
                into two separate accounts.
              </li>
              <br />
              <li>
                All networks support operations on <b>mainnet</b> (
                <code>chain_code</code> = <code>mainnet</code>).
              </li>
              <br />
              <li>
                Polkadot&apos;s <b>testnet</b> is called Westend (
                <code>chain_code</code> = <code>westend</code>).
              </li>
              <br />
              <li>
                Solana has both a <b>testnet</b> (<code>chain_code</code> ={" "}
                <code>testnet</code>) and a <b>devnet</b>, (
                <code>chain_code</code> = <code>devnet</code>).
              </li>
              <br />
              <hr />
              <br />
              <li>
                Check out{" "}
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://docs.figment.io/api-reference/staking-api/near#create%20new%20delegation%20flow"
                >
                  Create New Delegation Flow on NEAR
                </Link>{" "}
                for sample request and response data.
              </li>
            </ul>
          </Modal>
          <div className="row">
            <h1 className={styles.title}>Initialize a Flow</h1>
          </div>
          <Button
            style={{ width: "auto", marginTop: "20px" }}
            type="primary"
            onClick={() => showModal()}
          >
            Details
          </Button>
          <div className="row">
            <p className={styles.description}>
              The Staking API supports several networks. Each network has a set
              of available operations. A flow can operate on testnet or mainnet.
              <br />
              <br />
              When initializing a flow, provide the <code>network</code>,
              <code>chain_code</code>, <code>operation</code> and Staking API{" "}
              <code>version</code>.
              <br />
              <br />
              The form below can be used to create a JSON request body which is
              sent to the Staking API for the purpose of initializing a new
              flow.
              <br />
              <br />
              <b>Note</b>: To provide a seamless experience, this walkthrough is
              currently limited to the Staking flow on NEAR testnet.
            </p>
          </div>{" "}
          {/* row */}
          <div className="row">
            <div className="column">
              <p>
                Click <b>Create JSON Request Body</b> to continue.
              </p>

              <form className="flowForm" onSubmit={handleSubmit} method="post">
                <label htmlFor="network_code">Network</label>
                <select
                  id="network_code"
                  name="networkCode"
                  required
                  defaultValue="near"
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
                  <option value="near">NEAR</option>
                  <option disabled value="polkadot">
                    Polkadot
                  </option>
                  <option disabled value="polygon">
                    Polygon
                  </option>
                  <option disabled value="solana">
                    Solana
                  </option>
                </select>

                <label htmlFor="chain_code">Chain Code</label>
                <select
                  id="chain_code"
                  name="chainCode"
                  required
                  defaultValue="testnet"
                >
                  <option disabled value="mainnet">
                    Mainnet
                  </option>
                  {selectedNetwork === "polkadot" ? (
                    <option value="westend">Westend</option>
                  ) : (
                    <option value="testnet">Testnet</option>
                  )}
                  {selectedNetwork === "solana" ? (
                    <option value="devnet">Devnet</option>
                  ) : (
                    ""
                  )}
                </select>

                {/* Networks support different operations, 
              so we are using conditional rendering to make the form dynamic. */}
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
                    <option value="split_stake_account">
                      Split Stake Account
                    </option>
                  ) : (
                    ""
                  )}
                </select>

                <label htmlFor="version">Version</label>
                <select id="version" name="version" required defaultValue="v1">
                  <option value="v1">v1</option>
                </select>
                {/* Clicking this button does not fetch from the Staking API,
                it only populates the display of the JSON payload. */}
                <Button
                  style={{ width: "auto" }}
                  type="primary"
                  htmlType="submit"
                >
                  Create JSON Request Body
                </Button>
              </form>
            </div>{" "}
            {/* column */}
            <br />
            <div className="column">
              {stepCompleted === 1 ? (
                <>
                  <p className="callout">
                    Step has already been completed. Please{" "}
                    <b>proceed to the next step</b> or <b>reset the flow</b>.
                  </p>
                </>
              ) : (
                ""
              )}
              {flowResponse ? (
                <>
                  <p>
                    Flow <b>{flowResponse?.state}</b> on{" "}
                    <b>{flowResponse?.network_code}</b>{" "}
                    <b>{flowResponse?.chain_code}</b>
                    <br />
                    Flow ID: <b>{flowResponse?.id}</b>.
                    <br />
                    Here is the complete Staking API response:
                  </p>
                  <pre className="responseFixed">
                    {JSON.stringify(flowResponse, null, 2)}
                  </pre>{" "}
                  <Button
                    type="primary"
                    onClick={() => setAppState({ stepCompleted: 1 })}
                    href={`/operations/${operation}/submit-data`}
                  >
                    Proceed to the next step &rarr;
                  </Button>
                  <br />
                  <br />
                  <Button
                    danger
                    style={{ width: "auto" }}
                    type="primary"
                    htmlType="button"
                    onClick={() => handleReset()}
                    icon={<WarningOutlined />}
                  >
                    Reset Flow
                  </Button>
                  <br />
                  <br />
                </>
              ) : (
                <>
                  {!formData ? (
                    <>
                      <p>
                        The request body will appear when you click{" "}
                        <b>Create Flow Payload</b>.
                        <br />
                        <br />{" "}
                        {/* 
                  These two linebreaks are the margin between the text and the spacer box 
                  TODO: Fix the styling
                  */}
                      </p>
                      <p className="spacer">
                        {/* This spacer intentionally left empty */}
                      </p>
                    </>
                  ) : (
                    ""
                  )}

                  {formData && !flowResponse ? (
                    <>
                      <p>
                        This is the JSON request body to initialize a Staking
                        API flow:
                      </p>
                      <pre className="payload">
                        {JSON.stringify(formData, null, 2)}
                      </pre>
                      <br />
                      <Button
                        style={{ width: "auto" }}
                        type="primary"
                        htmlType="button"
                        onClick={() => handleInitializeFlow()}
                      >
                        Initialize Flow with Staking API
                      </Button>
                      <br />
                      <Button
                        danger
                        style={{ width: "auto" }}
                        type="primary"
                        htmlType="button"
                        onClick={() => handleClearFormData()}
                        icon={<WarningOutlined />}
                      >
                        Clear JSON Request Body
                      </Button>
                    </>
                  ) : (
                    ""
                  )}
                </>
              )}
            </div>
          </div>
          <div className="footer">
            <Link href="/">Return to Main Page</Link>
          </div>
        </ConfigProvider>
      </div>
    </>
  );
}
