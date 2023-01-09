export default async function connection(req, res) {
  const HOSTNAME = "near-slate.datahub.figment.io";
  const ENDPOINT = "/api/v1/flows";
  const body = req.body;
  try {
    console.log("Creating Staking API flow: ", JSON.stringify(body, null, 2));
    const response = await fetch(`https://${HOSTNAME}${ENDPOINT}`, {
      method: "POST",
      headers: {
        Authorization: process.env.API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.status >= 400) {
      const error = await response.text();

      if (!process.env.API_KEY) {
        res.status(200).send(error);
        Error.stackTraceLimit = 0; // Prevent stack trace
        throw new Error(
          `\n Missing API key in .env!\n Paste a valid Figment API key in .env after API_KEY=, save the .env file, \n then restart the Next.js Development server: \n- Stop the server by pressing CTRL+C in this terminal \n- Restart it with the command "npm run dev"\n\nFor complete instructions, please refer to the README.md file in the root of this repository.`
        );
      }

      res.status(200).send(error);
      if (response.status === 401) {
        Error.stackTraceLimit = 0; // Prevent stack trace
        throw new Error(
          `Status ${response.status}, response from server : ${error}`
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
