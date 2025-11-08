import ToggleDarkModeButton from './buttons/ToggleDarkModeButton.tsx';

function SiteFooter() {
  return (
    <footer
      className="text-md mx-4 mt-8 flex h-16 max-w-full items-center justify-between border-t-2 border-bgsecondary bg-bgprimary px-4 text-primary util-transition md:mx-auto md:min-w-4xl"
      role="contentinfo"
    >
      <div>© {new Date().getFullYear()} Ethan&apos;s Blog. All rights reserved.</div>
      <ToggleDarkModeButton />
    </footer>
  );
}

export default SiteFooter;
