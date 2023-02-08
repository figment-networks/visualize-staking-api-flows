export default async function connection(req, res) {
  const body = req.body;
  const HOSTNAME = "near-slate.datahub.figment.io";
  const ENDPOINT = `/api/v1/flows/${body?.flow_id}/next`;

  try {
    const response = await fetch(`https://${HOSTNAME}${ENDPOINT}`, {
      method: "PUT",
      headers: {
        Authorization: process.env.API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "sign_delegate_tx",
        inputs: {
          transaction_payload: body.signed_payload,
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
      const result = await response.json();
      console.log("Payload sent to Staking API. Response: ", result);
      res.status(200).json(result);
    }
  } catch (err) {
    console.error(err);
  }
}
