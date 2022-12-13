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
  backupAppState: initialState,
});

export default function AppStateProvider({ children }) {
  const [appState, _setAppState] = useState({ ...initialState });

  function setAppState(data) {
    const update = {
      ...appState,
      ...data,
    };
    saveState("appState", JSON.stringify(update));
    _setAppState({ ...update });
  }

  function backupAppState(data) {
    const update = {
      ...appState,
      ...data,
    };
    saveState("appStateBackup", JSON.stringify(update));
    _setAppState({ ...update });
  }

  function saveState(key, value) {
    localStorage.setItem(key, value);
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
        backupAppState
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  return useContext(AppStateContext);
}
