// @ts-nocheck
import React from "react";
import { Tooltip } from "antd";

export default function ToolTipComponent({
  children,
  placement = "top",
  title,
}) {
  return (
    <span>
      <style jsx>{`
        span > * {
          cursor: help;
        }
      `}</style>
      <Tooltip placement={placement} title={title} arrowPointAtCenter>
        {children}
      </Tooltip>
    </span>
  );
}
