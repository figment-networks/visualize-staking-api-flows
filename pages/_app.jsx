import React from "react";
import { ConfigProvider } from "antd";
import { AnimatePresence } from "framer-motion";
import ErrorBoundary from "@components/ErrorBoundary";
import AppStateProvider from "@utilities/appState";
import "../styles/main.css";

export default function WalkthroughApp({ Component, pageProps, router }) {
  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait" initial={true}>
        <AppStateProvider>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#0B703F", // Used to style the Pagination component in /view-all-flows
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
