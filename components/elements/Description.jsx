import React from "react";

export default function Description({ children }) {
  <>
    <style jsx>{`
      p.description {
        text-align: left;
        line-height: 1.5;
        font-size: 1.6rem;
        background-color: rgba(255, 255, 255, 0.5);
        padding: 20px;
        border-radius: 15px;
        margin-top: 50px;
        justify-content: center;
        align-items: center;
        min-width: 800px;
      }
    `}</style>
    <p className="description">{children}</p>
  </>;
}
