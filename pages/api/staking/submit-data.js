export default async function connection(req, res) {
  const body = req.body;
  const HOSTNAME = "near-slate.datahub.figment.io";
  const ENDPOINT = `/api/v1/flows/${body.flow_id}/next`;

  try {
    const response = await fetch(`https://${HOSTNAME}${ENDPOINT}`, {
      method: "PUT",
      headers: {
        Authorization: process.env.API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: body.action,
        inputs: {
          delegator_address: body.inputs.delegator_address,
          delegator_pubkey: body.inputs.delegator_pubkey,
          validator_address: body.inputs.validator_address,
          amount: body.inputs.amount,
          max_gas: body.inputs.max_gas,
        },
      }),
    });

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
