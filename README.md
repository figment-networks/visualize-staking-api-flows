# Figment Staking API Walkthrough

Welcome to the Figment Staking API Walkthrough. The goal is to provide you with a way to visualize and interact with Staking API flows, to better understand them. This is intended as a visualization tool and does not require you to dive into the codebase, however you can still do so if you wish.

## Requirements

- An up to date version of [git](https://git-scm.com).
- [Node.js](https://nodejs.org/en/) v14+, which is bundled with the `npm` package manager.

## Walkthrough App

The application uses the Next.js framework to display information about each flow. If you have previously used the [Figment APIs Demo App](https://github.com/figment-networks/figment-apis-demo-app), you will find most of this codebase to be quite similar.

### 1. Clone Repo

#### Which Method Should I Use?

The preferred method is to [add an SSH key to your GitHub account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account), if you do not already have one.

Otherwise, clone the repo with the HTTPS method as a fallback.

#### SSH Method

`git clone git@github.com:figment-networks/visualize-staking-api-flows.git`

#### HTTPS Method

`git clone https://github.com/figment-networks/visualize-staking-api-flows.git`

### 2. Enter Directory

`cd visualize-staking-api-flows`

### 3. Install Dependencies

`npm install`

### 4. Add Figment API Key

`cp .env.template .env` &rarr; Copies the template file to `.env`.

Paste a valid Figment API key in `.env`, after the variable `API_KEY=` then save the file.

If you don't already have an API key, reach out to Figment.

**Note**: The `.env` file is already included in the `.gitignore` file.
Once you have added your API key, make sure to keep it safe to avoid exposing it.
Check out Figment's [API Key Best Practices](https://docs.figment.io/guides/manage-and-secure-api-keys#api-key-best-practices).

### 5. Run the Demo App

Ensure you have added a Figment API key to `.env` _before_ you run the server.

`npm run dev` &rarr; starts the Next.js Development server.

### 6. Get Started

Navigate to [https://localhost:4000](https://localhost:4000) in your browser.

From here, you'll want to create a NEAR testnet account before starting with the flows.

## Private Keys Disclaimer

The code in `pages/api/accounts/create-near-account.js` creates a randomly generated account ID and keypair. The private key for this account is kept in the local storage of your web browser when running the demo. While this facilitates the demo experience, it's not a secure pattern for production-grade apps.

**The keypairs used in this demo app are for use on the NEAR testnet only!**

In production, private keys should never be exposed, shared, and _especially not_ stored in browser local storage.

If you have any questions about keypairs on NEAR, please take a moment to familiarize yourself with the [NEAR account model](https://docs.near.org/concepts/basics/accounts/model) before proceeding.
