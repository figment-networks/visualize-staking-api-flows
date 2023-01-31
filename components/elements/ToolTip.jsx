// @ts-nocheck
import React from "react";
import { Tooltip } from "antd";

export default function ToolTipComponent({
  children,
  placement = "top",
  title,
}) {
  return (
    <Tooltip placement={placement} title={title} arrowPointAtCenter>
      <span style={{ textDecoration: "underline" }}>{children}</span>
    </Tooltip>
  );
}
