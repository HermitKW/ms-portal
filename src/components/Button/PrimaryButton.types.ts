import { MouseEventHandler } from "react";

export interface PrimaryButtonProps {
  text: string;
  id: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}
