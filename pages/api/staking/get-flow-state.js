export default async function connection(req, res) {
  const body = req.body;
  const HOSTNAME = "near-slate.datahub.figment.io";
  const ENDPOINT = `/api/v1/flows/${body.flow_id}`;
  try {
    const response = await fetch(`https://${HOSTNAME}${ENDPOINT}`, {
      method: "GET",
      headers: {
        Authorization: process.env.API_KEY,
      },
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
