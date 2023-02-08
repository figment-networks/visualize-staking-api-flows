// @ts-nocheck
import React, { createContext, useContext, useState, useEffect } from "react";

const initialState = {
  accountAddress: "", // Randomly generated .testnet address
  accountPublicKey: "", // Randomly generated keypair
  accountPrivateKey: "", // Randomly generated keypair
  flowId: "", // Unique Flow ID
  flowState: "", // Flow state: initialized > sign_delegate_tx > delegate_tx_broadcasting > delegated
  flowActions: "", // Action(s) for initialized state
  flowInputs: [], // Inputs for a given action
  flowLabels: [], // Title Case, matches inputs
  inputs: [], // An array of combined inputs and labels used to construct a form based on the Staking API response
  flowResponse: "", // Capture the Staking API response
  responseData: "", // Capture the Staking API response
  errorResponse: "", // Capture any error response from the Staking API
  transitionErrorResponse: "", // Capture any transition error from the Staking API
  errorResponseTimestamp: "", // Capture error response timestamp from the Staking API
  unsignedTransactionPayload: "", // Returned by the Staking API
  decodedTransactionPayload: "", // Decoded using @figmentio/slate or multi-chain-signer-sdk
  signedTransactionPayload: "", // Signed using @figmentio/slate or multi-chain-signer-sdk
  validatorAddress: "", // Store the validator address for verification during decode/sign
  delegateAmount: "", // Store the delegation amount for verification during decode/sign
  stepCompleted: 0, // Which step has been completed
  flowCompleted: false, // Have all steps of a flow been completed
  pageItem: [], // Paginated flow data used on the View All Flows page
  loaded: false, // loaded from localstorage
};

const AppStateContext = createContext({
  appState: initialState,
  setAppState: undefined,
  clearAppState: undefined,
});

export default function AppStateProvider({ children }) {
  const [appState, _setAppState] = useState({ ...initialState });

  function setAppState(data) {
    const update = {
      ...appState,
      ...data,
    };

    localStorage.setItem(
      "visualize-staking-api-flows_appState",
      JSON.stringify(update)
    );

    // Backup prevents unnecessary loss of testnet tokens if the appState is lost
    if (
      !localStorage.getItem("visualize-staking-api-flows_accountBackup") &&
      !!data.accountAddress
    ) {
      localStorage.setItem(
        "visualize-staking-api-flows_accountBackup",
        JSON.stringify({
          accountAddress: data.accountAddress,
          accountPublicKey: data.accountPublicKey,
          accountPrivateKey: data.accountPrivateKey,
        })
      );
    }

    _setAppState({ ...update });
  }

  function clearState() {
    setAppState({ ...initialState });
  }

  useEffect(() => {
    const dataString =
      localStorage.getItem("visualize-staking-api-flows_appState") || "{}";
    const dataObject = JSON.parse(dataString);
    setAppState({ ...initialState, ...dataObject, loaded: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppStateContext.Provider
      value={{
        appState,
        setAppState,
        clearState,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  return useContext(AppStateContext);
}
