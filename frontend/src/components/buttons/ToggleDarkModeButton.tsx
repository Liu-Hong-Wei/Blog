import DarkModeIcon from "../icons/DarkModeIcon";
import LightModeIcon from "../icons/LightModeIcon";
import Button from "./Button";

export default function ToggleDarkModeButton( ) {
  return (
    <Button
      className={`flex justify-center items-center`}
      aria-label="Toggle Dark Mode"
    >
        <DarkModeIcon />
        <LightModeIcon />
    </Button>
  );
}
