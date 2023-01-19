import React from "react";
import { ConfigProvider } from "antd";
import { AnimatePresence } from "framer-motion";
import ErrorBoundary from "@components/ErrorBoundary";
import AppStateProvider from "@utilities/appState";
import "@styles/globals.css";

export default function WalkthroughApp({ Component, pageProps, router }) {
  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait" initial={true}>
        <AppStateProvider>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#0B703F", // Primary button colors from Figment DSL - #034d76 / #0D858B / #0B703F
                colorError: "#C01005", // Used when button has a danger property set
              },
            }}
          >
            <Component {...pageProps} key={router.asPath} />
          </ConfigProvider>
        </AppStateProvider>
      </AnimatePresence>
    </ErrorBoundary>
  );
}
