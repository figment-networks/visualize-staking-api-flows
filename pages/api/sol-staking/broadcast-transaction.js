const slate = require("@figmentio/slate");

export default async function connection(req, res) {
  const body = req.body;
  const HOSTNAME = "near-slate.datahub.figment.io";
  const ENDPOINT = `/api/v1/flows/${body?.flow_id}/next`;

  try {
    let signed = "";

    let action_name = "refresh_delegate_tx";

    const submit = await fetch(`https://${HOSTNAME}${ENDPOINT}`, {
      method: "PUT",
      headers: {
        Authorization: process.env.API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: action_name,
      }),
    });

    const submit_result = await submit.json();

    if (body.action === "create_new_stake_account") {
      signed = await slate.sign(
        "solana",
        "v1",
        submit_result.data.create_stake_account_transaction.raw,
        [body.privateKey]
      );
    }

    if (body.action === "sign_delegate_tx") {
      signed = await slate.sign(
        "solana",
        "v1",
        submit_result.data.delegate_transaction.raw,
        [body.privateKey]
      );
    }

    const response = await fetch(`https://${HOSTNAME}${ENDPOINT}`, {
      method: "PUT",
      headers: {
        Authorization: process.env.API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "sign_delegate_tx",
        inputs: {
          transaction_payload: signed,
        },
      }),
    });

    if (response.status >= 400) {
      res.status(response.status).json(await response.text());

      throw new Error(
        `${response.status} response from server - ${JSON.stringify(
          response.body,
          null,
          2
        )}`
      );
    }

    if (response.status === 200) {
      res.status(200).json(await response.json());
    }
  } catch (err) {
    console.error("Serverside Error: ", err);
    res.status(500).json(err);
  }
}
