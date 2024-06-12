import { MouseEventHandler, ReactNode } from "react";

export interface FontIconButtonProps {
  id: string;
  ariaLabel: string;
  children: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
}
