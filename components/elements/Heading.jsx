import React from "react";

export default function Heading({ children }) {
  return (
    <>
      <style jsx>{`
        h2 {
          margin: 2rem auto;
          font-weight: 400;
          font-size: 3.6rem;
          line-height: 1.4;
          text-align: center;
          width: auto;
          max-width: 800px;
        }
      `}</style>
      <h2>{children}</h2>
    </>
  );
}
