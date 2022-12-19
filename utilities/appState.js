// @ts-nocheck
import React, { createContext, useContext, useState, useEffect } from "react";

const initialState = {
  flowId: "",
  flowState: "",
  flowActions: "",
  flowInputs: [],
  flowLabels: [],
  inputs: [],
  flowResponse: "",
  responseData: "",
  accountPublicKey: "",
  accountAddress: "",
  accountPrivateKey: "",
  unsignedTransactionPayload: "",
  decodedTransactionPayload: "",
  signedTransactionPayload: "",
  validatorAddress: "",
  delegateAmount: "",
  stepCompleted: "",
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

    localStorage.setItem("appState", JSON.stringify(update));

    if (!localStorage.getItem("accountBackup") && !!data.accountAddress) {
      localStorage.setItem(
        "accountBackup",
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
    const dataString = localStorage.getItem("appState") || "{}";
    const dataObject = JSON.parse(dataString);
    setAppState({ ...initialState, ...dataObject });
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
