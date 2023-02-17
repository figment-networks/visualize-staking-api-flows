export default async function getFlows(req, res) {
  const body = req.body;
  const HOSTNAME = "solana-slate.datahub.figment.io";
  const ENDPOINT = `/api/v1/flows?page=${body.page}`;
  try {
    const response = await fetch(`https://${HOSTNAME}${ENDPOINT}`, {
      method: "GET",
      headers: {
        Authorization: process.env.API_KEY,
      },
    });
    if (response.status >= 400) {
      const date = new Date().toLocaleTimeString();
      const result = await response.text();
      res.status(200).json({ date, result });

      throw new Error(
        `${response.status} response from server - ${JSON.stringify(
          response.body
        )}`
      );
    }
    if (response.status === 200) {
      res.status(200).json(await response.json());
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
}
