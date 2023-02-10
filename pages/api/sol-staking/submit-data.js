export default async function connection(req, res) {
  const body = req.body;
  const HOSTNAME = "near-slate.datahub.figment.io";
  const ENDPOINT = `/api/v1/flows/${body.flow_id}/next`;

  try {
    let response = {};

    if (body.action === "create_delegate_tx") {
      response = await fetch(`https://${HOSTNAME}${ENDPOINT}`, {
        method: "PUT",
        headers: {
          Authorization: process.env.API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: body.action,
          inputs: {
            validator_address: body.inputs.validator_address,
          },
        }),
      });
    }

    if (body.action === "create_new_stake_account") {
      response = await fetch(`https://${HOSTNAME}${ENDPOINT}`, {
        method: "PUT",
        headers: {
          Authorization: process.env.API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: body.action,
          inputs: {
            funding_account_pubkey: body.inputs.funding_account_pubkey,
            stake_authority_pubkey: body.inputs.stake_authority_pubkey,
            withdraw_authority_pubkey: body.inputs.withdraw_authority_pubkey,
            amount: body.inputs.amount,
          },
        }),
      });
    }

    if (response.status >= 400) {
      const date = new Date().toLocaleTimeString();
      const result = await response.json();
      res.status(200).json({ date, result });

      Error.stackTraceLimit = 0; // Prevent stack trace
      throw new Error(
        `${date}: ${response.status} response from server: ${JSON.stringify(
          result,
          null,
          2
        )}`
      );
    }

    if (response.status === 200) {
      const date = new Date().toLocaleTimeString();
      const result = await response.json();
      res.status(200).json({ date, result });
    }
  } catch (err) {
    console.error(err);
  }
}
