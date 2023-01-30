import React from "react";
import Head from "next/head";

export default function HeadComponent(props) {
  const {
    title = `Visualize Figment's Staking API`,
    description = `Visualize Figment's Staking API`,
  } = props;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
