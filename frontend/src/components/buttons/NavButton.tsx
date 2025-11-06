import { NavLink } from "react-router";

import Button from "./Button";
import type { NavButtonProps } from "../../types/types";

export default function ravButton({ onClick, className = "", to, ariaLabel, ariaExpanded, ariaControls, children }: NavButtonProps) {
  let child = children;
  if (to) {
    child = (
      <NavLink
        to={to}
        className={({ isActive }) =>
          isActive
            ? "text-secondary font-bold no-underline"
            : "text-primary hover:underline hover:underline-offset-2"
        }
      >
        {children}
      </NavLink>
    );
  }

  return (
    <Button
      className={`flex justify-center items-center ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      type="button"
    >
      {child}
    </Button>
  );
}
