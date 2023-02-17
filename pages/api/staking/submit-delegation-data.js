export default async function connection(req, res) {
  const body = req.body;
  const HOSTNAME = "solana-slate.datahub.figment.io";
  const ENDPOINT = `/api/v1/flows/${body.flow_id}/next`;

  try {
    console.log(body);

    const response = await fetch(`https://${HOSTNAME}${ENDPOINT}`, {
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

    if (response.status >= 400) {
      const date = new Date().toLocaleTimeString();
      const result = await response.json();
      console.log(result);
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
      console.log(result);
      res.status(200).json({ date, result });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
}
