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
        div {
          cursor: default;
          text-decoration: underline;
        }
      `}</style>
      <Tooltip placement={placement} title={title} arrowPointAtCenter>
        {children}
      </Tooltip>
    </>
  );
}
