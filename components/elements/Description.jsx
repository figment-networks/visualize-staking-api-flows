import React from "react";

export default function Description({ children, maxWidth = 900 }) {
  return (
    <>
      <style jsx>{`
        p {
          text-align: left;
          line-height: 1.5;
          font-size: 1.6rem;
          background-color: rgba(255, 255, 255, 0.5);
          padding: 20px;
          border-radius: 15px;
          margin-top: 50px;
          justify-content: center;
          align-items: center;
          max-width: ${maxWidth}px;
        }
      `}</style>
      <p>{children}</p>
    </>
  );
}
