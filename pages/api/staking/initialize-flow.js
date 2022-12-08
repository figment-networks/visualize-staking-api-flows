export default async function connection(req, res) {
  const HOSTNAME = "near-slate.datahub.figment.io";
  const ENDPOINT = "/api/v1/flows";
  const body = req.body;
  try {
    const response = await fetch(`https://${HOSTNAME}${ENDPOINT}`, {
      method: "POST",
      headers: {
        Authorization: process.env.API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        flow: {
          network_code: body.network_code,
          chain_code: body.chain_code,
          operation: body.operation,
          version: body.version,
        },
      }),
    });

    if (response.status >= 400) {
      res.status(200).json(await response.text());
      throw new Error(
        `${response.status} response from server - ${JSON.stringify(
          response.body
        )}`
      );
    }

    if (response.status === 200) {
      res.status(200).json(await response.json());
    }
  } catch (err) {
    console.error(err);
  }
}
