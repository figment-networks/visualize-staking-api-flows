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
      const error = await response.json();

      if (!process.env.API_KEY) {
        res.status(200).json(error);
        throw new Error(
          `Missing API key in .env! Please add a valid Figment API key to .env, then restart the Next.js Development server to continue.`
        );
      }

      res.status(200).json();
      if (response.status === 401) {
        Error.stackTraceLimit = 0; // Prevent stack trace
        throw new Error(
          `Status ${response.status}, response from server : ${Object.keys(
            error
          )}`
        );
      }
      throw new Error(
        `Status ${response.status}, response from server : ${error}`
      );
    }

    if (response.status === 200) {
      res.status(200).json(await response.json());
    }
  } catch (err) {
    console.error(err);
  }
}
