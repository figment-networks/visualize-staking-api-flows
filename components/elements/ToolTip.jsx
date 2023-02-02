// @ts-nocheck
import React from "react";
import { Tooltip } from "antd";

export default function ToolTipComponent({
  children,
  placement = "top",
  title,
  ...props
}) {
  return (
    <Tooltip
      color={"#111111"}
      placement={placement}
      title={title}
      arrowPointAtCenter
    >
      <span {...props}>{children}</span>
    </Tooltip>
  );
}
