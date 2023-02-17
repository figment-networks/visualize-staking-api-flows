// @ts-nocheck
const slate = require("@figmentio/slate");

export default async function connection(req, res) {
  const body = req.body;
  const HOSTNAME = "solana-slate.datahub.figment.io";
  const ENDPOINT = `/api/v1/flows/${body?.flow_id}/next`;
  const GET_FLOW_STATE = `/api/v1/flows/${body?.flow_id}`;

  try {
    // Solana has a 90 second signing window,
    // to prevent bad UX, we can refresh and sign immediately
    // before broadcast. There are other ways to do this
    // using durable nonces, but we chose this method for simplicity.
    // This is not a production-grade solution.

    const flow_state = await fetch(`https://${HOSTNAME}${GET_FLOW_STATE}`, {
      method: "GET",
      headers: {
        Authorization: process.env.API_KEY,
      },
    });

    const flow_response = await flow_state.json();

    console.log("Flow state: ", flow_response.state);

    const submit = await fetch(`https://${HOSTNAME}${ENDPOINT}`, {
      method: "PUT",
      headers: {
        Authorization: process.env.API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "refresh_delegate_tx",
      }),
    });

    const submit_result = await submit.json();
    console.log("Refreshed delegate_tx: ", submit_result);

    const signed = await slate.sign(
      "solana",
      "v1",
      submit_result?.data.delegate_transaction.raw,
      [body.privateKey]
    );

    if (submit_result?.code === "transition_error") {
      res
        .status(200)
        .json({ date: new Date().toLocaleTimeString(), submit_result });
    }

    const response = await fetch(`https://${HOSTNAME}${ENDPOINT}`, {
      method: "PUT",
      headers: {
        Authorization: process.env.API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: body.action,
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
      throw new Error(`${response.status} ${response.statusText} `);
    }

    if (response.status === 200) {
      res.status(200).json(await response.json());
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
}
