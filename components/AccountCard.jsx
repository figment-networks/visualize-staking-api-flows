// @ts-nocheck
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Tooltip } from "antd";
import styles from "@styles/Home.module.css";

import { useAppState } from "@utilities/appState";

export const explorerUrl = (address) =>
  `https://explorer.testnet.near.org/accounts/${address}`;

export default function AccountCard(props) {
  const { appState, setAppState } = useAppState();
  const { stepCompleted, flowId } = appState;

  const router = useRouter();
  const [isIndexPage, setIsIndexPage] = useState(false);
  console.log(router.pathname);

  useEffect(() => {
    setIsIndexPage(router.pathname === "/" ? true : false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // This function indicates the correct route
  // based on which step has been completed
  function whichRoute(stepCompleted) {
    switch (stepCompleted) {
      case 0:
        return "/operations/staking/create-flow";
      case 1:
        return "/operations/staking/submit-data";
      case 2:
        return "/operations/staking/sign-payload";
      case 3:
        return "/operations/staking/broadcast-transaction";
      case 4:
        return "/operations/staking/flow-state";
      case 5:
        return "/operations/staking/create-flow";
      default:
        return "/operations/staking/create-flow";
    }
  }

  return (
    <>
      {props.accountAddress && isIndexPage ? (
        <>
          <Link
            href={whichRoute(stepCompleted)}
            style={{ textDecoration: "none" }}
          >
            <div className={styles.card} style={{ width: "300px" }}>
              <Tooltip
                placement="top"
                className={styles.ttip}
                title={`For your reference, this is a shortened version of the NEAR testnet address created by this app`}
                arrowPointAtCenter
              >
                <p
                  className={styles.centerLabel}
                  style={{ fontSize: "0.85rem" }}
                >
                  {props.accountAddress.toString().slice(0, 6) +
                    "..." +
                    props.accountAddress.toString().slice(42, -8) +
                    ".testnet"}
                </p>
              </Tooltip>

              {stepCompleted === 0 && (
                <p className={styles.centerLabel}>Get into the flow &rarr;</p>
              )}

              {stepCompleted && stepCompleted < 5 ? (
                <p className={styles.centerLabel}>
                  Continue flow {flowId ? flowId : ""} &rarr;
                </p>
              ) : (
                ""
              )}

              {stepCompleted && stepCompleted === 5 && (
                <>
                  <br />
                  <p className={styles.centerLabel}>Start a new flow &rarr;</p>
                </>
              )}
            </div>
          </Link>
          <br />
        </>
      ) : (
        <>
          <div
            className={styles.card}
            style={{ width: "1100px", minWidth: "1000px" }}
          >
            <h2 className="address">Account Address &rarr;</h2>
            <Link className="ext_link" href={explorerUrl(props.accountAddress)}>
              {props.accountAddress}
            </Link>

            {props.accountPublicKey && (
              <>
                <h3 className="pubkey">Account Public Key &rarr;</h3>
                <p>{props.accountPublicKey}</p>
              </>
            )}

            {props.accountPrivateKey && (
              <>
                <h3 className="pubkey">
                  Account Private Key (hover to reveal) &rarr;
                </h3>
                <p className="secret">{props.accountPrivateKey}</p>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
