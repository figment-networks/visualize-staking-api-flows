import { keyStores } from "near-api-js";

const nearConfig = {
  keyStore: new keyStores.InMemoryKeyStore(),
  nodeUrl: "https://rpc.testnet.near.org",
  networkId: "testnet",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://explorer.testnet.near.org",
};

export default nearConfig;
