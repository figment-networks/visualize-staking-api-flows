import slate from "@figmentio/slate";

export default async function decodePayload(req, res) {
  /**
   *  Decoding with @figmentio/slate:
   * 
   * - See https://www.npmjs.com/package/@figmentio/slate
   * - Also https://docs.figment.io/guides/staking-api/figment-signing-transactions#operations-and-transaction-types
   * 
      exports.decode = async (
        network,
        operation,
        version,
        transactionName,
        payload,
        options = {}
      ) => {
        const tx = new transactions[network][operation][version][transactionName](
          payload
        );
        const result = await tx.decode(options);

        return result;
      };
  */
  const body = req.body;

  const decoded = await slate.decode(
    body.network,
    body.operation,
    body.version,
    body.transaction_name,
    body.transaction_payload,
    {}
  );

  return res.status(200).json(decoded);
}
