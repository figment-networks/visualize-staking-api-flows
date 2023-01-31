import { useRouter } from "next/router";
import React from "react";

export default function Card({ children, maxWidth = 600, href = null }) {
  const router = useRouter();

  function goTo() {
    if (!href) return;
    router.push(href);
  }

  return (
    <div onClick={goTo}>
      <style jsx>{`
        div {
          width: 100%;
          max-width: ${maxWidth}px;
          margin: 0 auto;
          padding: 1.4rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 2px solid #c7e0e7;
          border-radius: 12px;
          transition: color 0.15s ease, border-color 0.15s ease;
          background-color: #ffffff;
          margin-bottom: 40px;
          cursor: ${href ? "pointer" : "default"};
        }

        div {
          overflow: hidden;
          text-overflow: ellipsis;
        }

        div:hover,
        div:focus,
        div:active {
          border-color: #034d76;
        }

        div > :global(a) {
          text-decoration: none;
        }

        div > :global(h3) {
          margin-top: 15px;
        }
      `}</style>
      {children}
    </div>
  );
}
