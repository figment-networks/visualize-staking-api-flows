import React from "react";
import Link from "next/link";
import AccountCard from "@components/AccountCard";
import { useAppState } from "@utilities/appState";
import Head from "@components/elements/Head";
// import Title from "@components/elements/Title";
// import Heading from "@components/elements/Heading";
// import Card from "@components/elements/Card";
import Footer from "@components/elements/Footer";

import { Title, Card, Button, Headline } from "./ui-components";

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

      <Headline>
        Learn how to use Figment&apos;s Staking API in an intuitive, visual
        format
      </Headline>

      {!loaded && <></>}

      {loaded && accountAddress && <AccountCard />}

      {loaded && !accountAddress && (
        <Card>
          <h3>NEAR Account &rarr;</h3>
          <p>Get started by creating a NEAR testnet account</p>
          <Button href="/create-near-account">Create NEAR Account</Button>
        </Card>
      )}

      {flowCompleted && (
        <Card>
          <h3>View All Flows &rarr;</h3>
          <p>Get information about all of the flows you have created</p>
          <Button href="/view-all-flows">View All Flows</Button>
        </Card>
      )}
      <Footer />
    </>
  );
}
