import Link from "next/link";

export const explorerUrl = (address) =>
  `https://explorer.testnet.near.org/accounts/${address}`;

export default function AccountCard(props) {
  return (
    <>
      {props.accountAddress ? (
        <>
          <div className="profile">
            <h2 className="address">
              <Link href="/accounts/create-near-account">Account Address</Link>{" "}
              &rarr;
            </h2>
            <Link className="ext_link" href={explorerUrl(props.accountAddress)}>
              {props.accountAddress}
            </Link>

            {props.accountPubKey ? (
              <>
                <h3 className="pubkey">Account Public Key &rarr;</h3>
                <p>{props.accountPubKey}</p>
              </>
            ) : (
              ""
            )}

            {props.accountPrivateKey ? (
              <>
                <h3 className="pubkey">
                  Account Private Key (hover to reveal, click to copy) &rarr;
                </h3>
                <p
                  className="secret"
                  onClick={() =>
                    navigator.clipboard.writeText(props.accountPrivateKey)
                  }
                >
                  {props.accountPrivateKey}
                </p>
              </>
            ) : null}
          </div>
        </>
      ) : null}
    </>
  );
}
