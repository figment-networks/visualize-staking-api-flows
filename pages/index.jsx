import React from "react";
import Link from "next/link";
import AccountCard from "@components/AccountCard";
import { useAppState } from "@utilities/appState";
import {
  Head,
  Title,
  Card,
  Button,
  Headline,
  Footer,
  Layout,
} from "./ui-components";

export default function IndexPage() {
  const {
    appState: { accountAddress, flowCompleted, loaded },
  } = useAppState();

  return (
    <>
      <Head
        title="Visualize Figment's Staking API"
        description="Visualize Figment's Staking API"
      />
      <Layout centerVertical>
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
          <Card small>
            <h5>NEAR Account &rarr;</h5>
            <p>Get started by creating a NEAR testnet account</p>
            <Button href="/create-near-account">Create NEAR Account</Button>
          </Card>
        )}

        {flowCompleted && (
          <Card small>
            <h5>View All Flows &rarr;</h5>
            <p>Get information about all of the flows you have created</p>
            <Button href="/view-all-flows">View All Flows</Button>
          </Card>
        )}
      </Layout>
      <Footer />
    </>
  );
}
