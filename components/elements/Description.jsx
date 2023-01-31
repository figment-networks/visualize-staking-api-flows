import React from "react";
import { Row, Col, Button, Modal, Steps, Tooltip } from "antd";

export default function Description({ children }) {
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
          min-width: 800px;
        }
      `}</style>
      <p>{children}</p>
    </>
  );
}
