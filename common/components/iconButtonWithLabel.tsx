import { IconButton } from "@mui/material";
import { ReactNode, MouseEventHandler } from "react";

const IconButtonWithLabel = ({
  children,
  href,
  onClick,
}: {
  children: ReactNode;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) => {
  return href ? (
    <IconButton
      color="inherit"
      sx={{ display: "flex", flexDirection: "column" }}
      href={href}
    >
      {children}
    </IconButton>
  ) : onClick ? (
    <IconButton
      color="inherit"
      sx={{ display: "flex", flexDirection: "column" }}
      onClick={onClick}
    >
      {children}
    </IconButton>
  ) : (
    <IconButton
      color="inherit"
      sx={{ display: "flex", flexDirection: "column" }}
    >
      {children}
    </IconButton>
  );
};

export default IconButtonWithLabel;
