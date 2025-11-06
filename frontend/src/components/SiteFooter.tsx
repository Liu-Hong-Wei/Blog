import ToggleDarkModeButton from "./buttons/ToggleDarkModeButton.tsx";

function SiteFooter() {
  return (
    <footer
      className="mx-4 flex h-16 max-w-full items-center justify-between border-t-2 border-bgsecondary px-4 text-md text-primary util-transition md:mx-auto md:min-w-3xl"
      role="contentinfo"
    >
      <div>© {new Date().getFullYear()} Ethan&apos;s Blog. All rights reserved.</div>
      <ToggleDarkModeButton />
    </footer>
  );
}

export default SiteFooter;