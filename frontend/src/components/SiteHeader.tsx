import { NavLink } from 'react-router';

import NavButton from '../components/buttons/NavButton';
import HamburgerIcon from '../components/icons/HamburgerIcon';
import useIsScrolling from '../hooks/useIsScrolling';

const NAV_LINKS = [
  { to: '/posts', label: 'Posts' },
  { to: '/ideas', label: 'Ideas' },
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
] as const;

interface SiteHeaderProps {
  onOpenDrawer: () => void;
  isDrawerOpen: boolean;
}

interface NavLinksProps {
  orientation?: 'horizontal' | 'vertical';
  onNavigate?: () => void;
  className?: string;
}

export function NavLinks({
  orientation = 'horizontal',
  onNavigate,
  className = '',
}: NavLinksProps) {
  const layoutClasses =
    orientation === 'horizontal' ? 'flex-row items-center gap-4' : 'flex-col items-stretch gap-2';
  const buttonClasses =
    orientation === 'horizontal'
      ? 'justify-center px-2 py-1'
      : 'w-full justify-start px-4 py-2 text-left';

  return (
    <ul
      className={`flex text-2xl ${layoutClasses} ${className}`}
      role="menubar"
      aria-orientation={orientation}
    >
      {NAV_LINKS.map(({ to, label }) => (
        <li key={to} role="menuitem">
          <NavButton
            to={to}
            onClick={onNavigate}
            ariaLabel={`${label} link`}
            className={buttonClasses}
          >
            {label}
          </NavButton>
        </li>
      ))}
    </ul>
  );
}

function SiteHeader({ onOpenDrawer, isDrawerOpen }: SiteHeaderProps) {
  const { isAtTop } = useIsScrolling();

  return (
    <header
      role="banner"
      className="sticky top-2 z-50 mx-4 my-2 flex justify-center md:mx-auto md:min-w-3xl util-transition"
    >
      <nav
        className={`flex h-12 w-full max-w-full items-center justify-between rounded-xl bg-bgprimary/70 px-4 backdrop-blur-xl ${isAtTop ? '' : 'shadow-sm ring-1 shadow-bgsecondary ring-bgsecondary'} util-transition`}
        aria-label="Primary navigation"
      >
        <NavLink className="text-2xl font-bold" to="/">
          Ethan&apos;s Blog
        </NavLink>
        <div className="flex items-center">
          <NavLinks className="hidden md:flex" />
          <NavButton
            onClick={onOpenDrawer}
            className="ml-2 md:hidden"
            ariaLabel="Open navigation menu"
            aria-expanded={isDrawerOpen}
            aria-controls="mobile-navigation"
          >
            <HamburgerIcon />
          </NavButton>
        </div>
      </nav>
    </header>
  );
}

export default SiteHeader;
