import React from "react";
import Link from "next/link";
import AccountCard from "@components/AccountCard";
import { useAppState } from "@utilities/appState";
import Head from "@components/elements/Head";
import Title from "@components/elements/Title";
import Heading from "@components/elements/Heading";
import Card from "@components/elements/Card";
import Footer from "@components/elements/Footer";

export default function IndexPage() {
  const {
    appState: { accountAddress, flowCompleted, loaded },
  } = useAppState();

  return (
    <>
      <Head />
      <Title>
        Visualize Figment&apos;s&nbsp;
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="https://docs.figment.io/guides/staking-api"
        >
          Staking API
        </Link>
      </Title>
      <Heading>
        Learn how to use Figment&apos;s Staking API in an intuitive, visual
        format
      </Heading>

      {!loaded && <></>}

      {loaded && accountAddress && <AccountCard />}

      {loaded && !accountAddress && (
        <Card href="/create-near-account">
          <h3>NEAR Account &rarr;</h3>
          <p>Get started by creating a NEAR testnet account</p>
        </Card>
      )}

      {flowCompleted && (
        <Card href="/view-all-flows">
          <h3>View All Flows &rarr;</h3>
          <p>Get information about all of the flows you have created</p>
        </Card>
      )}
      <Footer />
    </>
  );
}
