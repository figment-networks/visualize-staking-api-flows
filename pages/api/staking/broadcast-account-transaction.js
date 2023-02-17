// @ts-nocheck
const slate = require("@figmentio/slate");

export default async function connection(req, res) {
  const body = req.body;
  const HOSTNAME = "solana-slate.datahub.figment.io";
  const ENDPOINT = `/api/v1/flows/${body?.flow_id}/next`;
  const GET_STATE = `/api/v1/flows/${body?.flow_id}`;

  try {
    // Solana has a 90 second signing window,
    // to prevent poor UX we can refresh the unsigned
    // payload so that it includes a recent blockhash
    // and sign it immediately before broadcast.
    // This is not a production-grade solution.
    let signed = "";
    const action_name = (op) => `refresh_${op}_tx`;
    console.log(action_name(body.type));

    const flow_state = await fetch(`https://${HOSTNAME}${GET_STATE}`, {
      method: "GET",
      headers: {
        Authorization: process.env.API_KEY,
      },
    });

    const { id: flow_id, state } = await flow_state.json();

    // If the flow state is already stake_account we don't
    // need to continue with assigning or creating a stake account
    if (state === "stake_account") {
      console.log(`Flow ${flow_id} state: ${state}`);
      res
        .status(400)
        .json({ date: new Date().toLocaleTimeString(), flow_state });
    }

    const refresh = await fetch(`https://${HOSTNAME}${ENDPOINT}`, {
      method: "PUT",
      headers: {
        Authorization: process.env.API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: action_name(body.type),
      }),
    });

    const { id: id, data, message, code } = await refresh.json();

    const isErrorFree = !message;
    const hasData = id && data.create_stake_account_transaction.raw;

    if (isErrorFree && hasData) {
      signed = await slate.sign(
        "solana",
        "v1",
        data.create_stake_account_transaction.raw,
        [body.privateKey]
      );
    }

    // Transition errors occur when passing incorrect
    // inputs for the given flow state
    if (code === "transition_error") {
      res
        .status(400)
        .json({ date: new Date().toLocaleTimeString(), code, message });
    }

    const response = await fetch(`https://${HOSTNAME}${ENDPOINT}`, {
      method: "PUT",
      headers: {
        Authorization: process.env.API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "sign_stake_account_tx",
        inputs: {
          transaction_payload: signed,
        },
      }),
    });

    if (response.status >= 400) {
      res.status(200).json({
        date: new Date().toLocaleTimeString(),
        result: await response.text(),
      });

      throw new Error(
        `${response.status} response from server - ${JSON.stringify(
          response.body,
          null,
          2
        )}`
      );
    }

    if (response.status === 200) {
      res.status(200).json({ success_response: await response.json() });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
}
