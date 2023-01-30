import React from "react";

export default function Title({ children }) {
  return (
    <>
      <style jsx>{`
        h1 {
          margin: 0;
          margin-top: 75px;
          line-height: 1.15;
          font-size: 3rem;
          color: #034d76;
          text-align: center;
          font-size: 5.6rem;
          color: #034d76;
        }

        h1 :global(a) {
          color: #0d858b;
          text-decoration: none;
        }

        h1 :global(a):hover,
        h1 :global(a):focus,
        h1 :global(a):active {
          text-decoration: underline;
        }
      `}</style>
      <h1>{children}</h1>
    </>
  );
}
