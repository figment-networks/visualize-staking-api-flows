const slate = require("@figmentio/slate");

export default async function signPayload(req, res) {
  const body = req.body;
  /**
     *  Signing with @figmentio/slate:
     * 
     *  - NEAR does not require any options, however networks like Polkadot and Cosmos do
     *  - Refer to https://docs.figment.io/guides/staking-api/figment-signing-transactions for details
     * 
        exports.sign = async (network, version, payload, privateKeys, options = {}) => {
            const tx = new transactions[network].signing[version].Transaction(payload);
            const result = await tx.sign(privateKeys, options);
        
            return result;
        };
     */

  const signed = await slate.sign("solana", "v1", body.transaction_payload, [
    body.privateKey,
  ]);

  res.status(200).json(signed);
}
