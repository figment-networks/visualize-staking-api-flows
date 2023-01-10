// @ts-nocheck
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Row, Col, Button, Modal, ConfigProvider, Tooltip, Steps } from "antd";
import {
  WarningOutlined,
  SolutionOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import styles from "@styles/Home.module.css";
import Footer from "@components/Footer";

import { useAppState } from "@utilities/appState";

export default function CreateFlow({ operation }) {
  const { appState, setAppState } = useAppState();
  const {
    flowId,
    flowState,
    flowResponse,
    flowInputs,
    flowLabels,
    stepCompleted,
    responseData,
    accountAddress,
    accountPublicKey,
    accountPrivateKey,
  } = appState;

  const [formData, setFormData] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  useEffect(() => {
    // To facilitate generating the form labels and input fields
    // for data collection in the next step, create an array of
    // objects containing both the input names and labels:
    // { name: "delegator_address", label: "Delegator Address" }
    if (!!appState.inputs.length) return; // Return early if the inputs are already defined
    const inputs = Array(flowInputs.length)
      .fill(null)
      .map((empty, index) => ({
        name: flowInputs[index],
        label: flowLabels[index],
      }));

    setAppState({ ...appState, inputs: inputs });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowResponse, flowInputs, flowLabels]);

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
      stepCompleted: 0,
      flowResponse: undefined,
      responseData: undefined,
      flowState: undefined,
      decodedTransactionPayload: undefined,
      unsignedTransactionPayload: undefined,
      signedTransactionPayload: undefined,
      validatorAddress: undefined,
      delegateAmount: undefined,
      flowActions: undefined,
      flowId: undefined,
      flowInputs: [],
      flowLabels: [],
      inputs: [],
    });
    setFormData(undefined);
    alert(
      `Reset request body and current flowId!\n` +
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
      const isErrorFree = !result.message;
      const hasData = result.id && result.state && result.actions;
      if (isErrorFree && hasData) {
        setAppState({
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

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#0D858B", // Primary button color
            colorError: "#C90000", // Used when button has a danger property set
          },
        }}
      >
        <Row justify="space-around">
          <Col span={24}>
            <div className={styles.header}>
              <Steps
                current={1}
                status="finish"
                type="navigation"
                items={[
                  {
                    title: "Create Account",
                    status: "finish",
                    icon: <CheckCircleOutlined />,
                  },
                  {
                    title: "Create a Flow",
                    status: "process",
                    icon: <SolutionOutlined />,
                  },
                  {
                    title: "Submit Data",
                    status: "wait",
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

        <h1 className={styles.title}>Create a Flow</h1>

        <Row justify="space-around">
          <Col span={10}>
            <p className={styles.description}>
              When creating a flow with Figment&apos;s Staking API, you must
              provide the <code>network</code>, <code>chain_code</code>,{" "}
              <code>operation</code> and Staking API <code>version</code>.
              <br />
              <br />
              Each flow is given a unique ID, which is referenced when
              continuing that flow or querying its details.
              <br />
              <br />
              The form below creates a JSON request body, which is sent to the
              Staking API to create a new flow.
              <br />
              <br />
              <Button
                size="large"
                type="primary"
                className={styles.modalButton}
                onClick={() => showModal()}
              >
                Click Here For More Information
              </Button>
            </p>
          </Col>
        </Row>

        <Row className={styles.paddingBottom}>
          <Col span={12}>
            <p className={styles.centerLabel}>
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
              <br />

              {/* Submitting this form does not fetch from the Staking API,
                it only populates the display of the JSON payload. */}

              <Button
                disabled={formData || stepCompleted === 5}
                className={styles.submitButton}
                type="primary"
                htmlType="submit"
              >
                Create JSON Request Body
              </Button>
            </form>
          </Col>

          <Col span={12}>
            {stepCompleted === 5 && (
              <>
                <p className="callout">
                  A previous flow <b>{flowId}</b> has already been completed.
                  Please <b>reset the flow</b> to continue.
                </p>

                <Tooltip
                  placement="bottomLeft"
                  title={`Click here to reset the current flow and appState`}
                  arrowPointAtCenter
                >
                  <Button
                    className={styles.resetButton}
                    type="primary"
                    htmlType="button"
                    onClick={() => handleResetFlow()}
                    icon={<WarningOutlined />}
                  >
                    Reset Flow
                  </Button>
                </Tooltip>
              </>
            )}

            {flowResponse && stepCompleted < 2 ? (
              <>
                <p style={{ lineHeight: "2.5rem" }}>
                  Flow ID{" "}
                  <Tooltip
                    className={styles.ttip}
                    placement="top"
                    title={`This is the flow's unique ID, which can be used to continue the flow or to query the API for the current details of the flow.`}
                    arrowPointAtCenter
                  >
                    <code>
                      <b>{flowResponse?.id}</b>
                    </code>
                  </Tooltip>{" "}
                  is{" "}
                  <Tooltip
                    className={styles.ttip}
                    placement="top"
                    title={`This is the flow's state, meaning that it has been created and the flow ID assigned. The flow will remain in this state until it is time to sign and broadcast the transaction.`}
                    arrowPointAtCenter
                  >
                    <code>
                      <b>{flowResponse?.state}</b>
                    </code>
                  </Tooltip>{" "}
                  <br />
                  &mdash; on <b>
                    {flowResponse?.network_code.toUpperCase()}
                  </b>{" "}
                  <b>{flowResponse?.chain_code}</b> with actions{" "}
                  <b>{JSON.stringify(flowResponse.actions[0].name)}</b>
                </p>
                <Button
                  size="large"
                  type="primary"
                  className={styles.proceedButton}
                  onClick={() => setAppState({ stepCompleted: 1 })}
                  href={`/operations/${operation}/submit-data`}
                >
                  Proceed to the next step &rarr;
                </Button>
                <br />
                <details>
                  <summary>Staking API response</summary>
                  <pre className={styles.responseFixedShort}>
                    {JSON.stringify(flowResponse, null, 2)}
                  </pre>
                </details>
              </>
            ) : (
              <>
                {!formData && stepCompleted !== 5 && (
                  <>
                    <br />
                    <br />
                    <p className="spacer">
                      The request body will appear when you click{" "}
                      <b>Create JSON Request Body</b>.
                    </p>
                  </>
                )}

                {formData && !flowResponse && (
                  <>
                    <p className={styles.desc}>
                      Sending this JSON request body to the
                      <Tooltip
                        placement="top"
                        title={`For more information, refer to the Figment Docs`}
                        arrowPointAtCenter
                        className={styles.tooltip}
                      >
                        {" "}
                        Staking API endpoint
                      </Tooltip>{" "}
                      will create a new flow:
                    </p>
                    <pre className="payload">
                      {JSON.stringify(formData, null, 2)}
                    </pre>
                    <br />
                    <Button
                      style={{ width: "auto" }}
                      type="primary"
                      htmlType="button"
                      onClick={() => handleCreateFlow()}
                    >
                      Send request to the Staking API
                    </Button>
                    <br />
                    <Button
                      style={{ width: "auto" }}
                      type="text"
                      htmlType="button"
                      onClick={() => handleClearFormData()}
                      icon={<WarningOutlined />}
                    >
                      Clear JSON Request Body
                    </Button>
                  </>
                )}
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
            <h4>
              <b>Note</b>: To provide a seamless experience, this app is
              currently limited to the staking flow on NEAR testnet.
            </h4>
            <li>
              Figment&apos;s Staking API supports several networks, each network
              has its own set of available operations.
              <br />
              Upon creation, each flow is given a unique ID.
              <br />
              A flow can be created on testnet or mainnet.
              <br />
              A flow will change state when an action has been completed.
              <br />
              Flow actions relate to each part of an operation &mdash; for
              example, a <code>staking</code> operation has the actions{" "}
              <code>create_delegate_tx</code>, <code>refresh_delegate_tx</code>{" "}
              and <code>sign_delegate_tx</code>.
            </li>
            <br />
            <li>
              The most common operations for the Staking API are{" "}
              <code>staking</code>, <code>unstaking</code> and{" "}
              <code>transfer</code>.
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
                href="https://docs.figment.io/guides/staking-api/near/delegate/create-new-flow"
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
                href="https://docs.figment.io/api-reference/staking-api/near#create%20new%20delegation%20flow"
              >
                Create New Delegation Flow on NEAR
              </Link>{" "}
              for sample request and response data.
            </li>
            <h4>Network specific operations:</h4>
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
              Polkadot has <code>add_proxy</code> and <code>remove_proxy</code>{" "}
              operations, which are useful for managing staking nominations.
            </li>
            <br />
            <li>
              Solana has <code>split_stake_account</code> and{" "}
              <code>merge_stake_account</code> operations, which are useful when
              managing stake account balances.
            </li>
            <h4>Network specific chain codes:</h4>
            <li>
              <b>All</b> networks support operations on <b>mainnet</b> (
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
          </ul>
        </Modal>
      </ConfigProvider>
    </>
  );
}