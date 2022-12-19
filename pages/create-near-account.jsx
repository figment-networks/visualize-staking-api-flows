import Link from "next/link";
import React, { useState } from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { Button, Modal, ConfigProvider } from "antd";
import { useAppState } from "@utilities/appState";
import AccountCard from "../components/AccountCard";

export default function CreateNEARAccountPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { appState, setAppState } = useAppState();

  // Destructure state variables
  const { accountPrivateKey, accountPublicKey, accountAddress } = appState;
  const [isLoading, setIsLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    const response = await fetch("api/accounts/create-near-account", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const { secretKey, publicKey, accountId } = await response.json();

    setAppState({
      accountPrivateKey: secretKey,
      accountPublicKey: publicKey,
      accountAddress: accountId,
    });

    setIsLoading(false);
  };

  const handleLoadAccount = async (event) => {
    event.preventDefault();

    if (!localStorage.getItem("accountBackup")) {
      alert("No existing account found. Please generate a new account!");
    }

    const account = JSON.parse(localStorage.getItem("accountBackup") || "{}");
    console.log(account);
    setIsLoading(true);
    setAppState({ ...account });
    setIsLoading(false);
  };

  const handleResetAccount = async () => {
    setAppState({
      accountPrivateKey: undefined,
      accountPublicKey: undefined,
      accountAddress: undefined,
    });
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
          <div className="row">
            <h1 className={styles.title}>Create a NEAR .testnet account</h1>
          </div>
          <Button
            style={{
              width: "auto",
              marginTop: "20px",
              paddingBottom: "10px",
              fontWeight: "bold",
            }}
            type="primary"
            onClick={() => showModal()}
          >
            Click Here For More Information
          </Button>
          {!accountAddress ? (
            <>
              <p className={styles.description}>
                Click the Create Account button to generate a random keypair and
                testnet account name, which is only intended for use with this
                demo of Figment&apos;s Staking API.
              </p>
            </>
          ) : (
            ""
          )}
          <form onSubmit={handleSubmit} method="post">
            {accountAddress ? (
              <b>Your testnet address for this demo is {accountAddress}</b>
            ) : (
              <>
                <div className="column">
                  <Button
                    style={{ width: "auto" }}
                    type="primary"
                    htmlType="submit"
                    disabled={isLoading ? true : false}
                  >
                    Create Account
                  </Button>{" "}
                  or{" "}
                  <Button
                    style={{ width: "auto" }}
                    type="primary"
                    htmlType="button"
                    onClick={handleLoadAccount}
                    disabled={isLoading ? true : false}
                  >
                    Load an Existing Account
                  </Button>
                </div>
              </>
            )}
          </form>
          <p className={styles.description}>
            The keypair will be saved, unencrypted, in your browser localStorage
            with the key{" "}
            <code>near-api-js:keystore:[account_id.testnet]:testnet</code>.
            <br />
            Click on &quot;Details&quot; above for more information.
          </p>
          <br /> <br />
          {isLoading ? "Loading..." : ""}
          {accountPublicKey && (
            <>
              <AccountCard
                accountPubKey={accountPublicKey}
                accountPrivateKey={accountPrivateKey}
                accountAddress={accountAddress}
              />
              <Button
                style={{ width: "auto" }}
                type="primary"
                htmlType="submit"
                disabled={isLoading ? true : false}
              >
                Create a New Account
              </Button>{" "}
              or{" "}
              <Button
                danger
                style={{ width: "auto", marginTop: "20px" }}
                type="primary"
                htmlType="button"
                onClick={handleResetAccount}
                disabled={isLoading ? true : false}
              >
                Reset Account (clear appState only)
              </Button>
              <Link href="/">Return to Main Page</Link>
            </>
          )}
          <br />
          <br />
          <Modal
            title="Details"
            width="50%"
            footer={null}
            open={isModalOpen}
            onCancel={handleCancel}
          >
            <ul>
              <li>
                To view or remove keypairs:
                <br />
                <br /> &rarr; Press <code>F12</code> in most browsers to open
                your browser tools
                <br />
                &rarr; Press <b>⌥ Option + ⌘ Command + I</b> on macOS
                <br />
                &rarr; Press <b>Ctrl + Shift + I</b> on Windows/Linux
                <br />
                <br />
                Navigate to the Storage tab (in Firefox) or the Application tab
                (in Chrome), then filter using the string{" "}
                <b>near-api-js:keystore</b>.<br />
              </li>
              <Image
                src="/img/localstorage_firefox.png"
                alt="localStorage on Firefox"
                width={900}
                height={170}
                className="inline_image"
              />
              <br />
              <Image
                src="/img/localstorage_chrome.png"
                alt="localStorage on Chrome"
                width={900}
                height={440}
                className="inline_image"
              />
            </ul>
          </Modal>
        </ConfigProvider>
      </div>
    </>
  );
}
