import React from "react";
import Link from "next/link";
import AccountCard from "@components/AccountCard";
import { useAppState } from "@utilities/appState";
import {
  DESCRIPTION,
  Head,
  Title,
  Card,
  Button,
  Headline,
  Footer,
  LayoutCenter,
} from "@components/ui-components";

export default function IndexPage() {
  const {
    appState: { accountAddress, flowCompleted, loaded },
  } = useAppState();

  const title = "Visualize Figment's Staking API";

  return (
    <>
      <Head title={title} description={DESCRIPTION} />
      <LayoutCenter>
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
          <>
            <Card small>
              <h5>Get started by creating a NEAR testnet account &rarr;</h5>
              <Button href="/create-near-account">Create NEAR Account</Button>
            </Card>
          </>
        )}

        <Card small>
          <h5>Get started by creating a Solana testnet account &rarr;</h5>
          <Button href="/create-solana-account">Create Solana Account</Button>
        </Card>

        {flowCompleted && (
          <Card small>
            <h5>
              Get information about all of the flows you have created &rarr;
            </h5>
            <Button href="/view-all-flows">View All Flows</Button>
          </Card>
        )}
      </LayoutCenter>
      <Footer />
    </>
  );
}
