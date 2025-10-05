import { NavLink } from "react-router";

import { NavButtonProps } from "../../types/types";
import Button from "./Button";

export default function NavButton({ onClick, className, to, ariaLabel, children }: NavButtonProps) {
  let child = children
  if (to) {
    child = <NavLink
      to={to}
      className={({ isActive }) => isActive ? "text-secondary font-bold no-underline" : "text-primary/50 hover:underline hover:underline-offset-2"}
    >
      {children}
    </NavLink>
  }

  return (
    <Button
      className={`flex justify-center items-center ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {child}
    </Button>
  );
}
