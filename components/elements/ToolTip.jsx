// @ts-nocheck
import React from "react";
import { Tooltip } from "antd";

export default function ToolTipComponent({
  children,
  placement = "top",
  title,
}) {
  return (
    <>
      <style jsx>{`
        code {
          cursor: help;
          text-decoration: underline;
          color: #fff29b;
        }
      `}</style>
      <Tooltip placement={placement} title={title} arrowPointAtCenter>
        <code>{children}</code>
      </Tooltip>
    </>
  );
}
