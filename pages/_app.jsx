import React from "react";
import ErrorBoundary from "../components/ErrorBoundary";
import AppStateProvider from "../utilities/appState";
import "../styles/globals.css";

export default function WalkthroughApp({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <AppStateProvider>
        <Component {...pageProps} />
      </AppStateProvider>
    </ErrorBoundary>
  );
}
