import { NavLink } from 'react-router';

import ToggleDarkModeButton from './buttons/ToggleDarkModeButton.tsx';
import SocialIcon from './icons/SocialIcon.tsx';
import { socialIcons } from '../constants/socialIcons';

const FOOTER_LINKS = [
  { to: '/posts', label: 'Posts' },
  { to: '/ideas', label: 'Ideas' },
  // { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
] as const;

function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-16 border-t border-bgsecondary/40 bg-bgprimary px-6 pt-10 pb-8 text-primary util-transition-colors md:px-12"
      role="contentinfo"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        {/* 品牌 + 简介 */}
        <div className="space-y-3">
          <NavLink
            to="/"
            className="text-xl font-bold text-primary transition-colors hover:text-secondary"
          >
            HongWei&apos;s Blog
          </NavLink>
          <p className="max-w-xs text-sm leading-relaxed text-primary/60">
            是谁来自山川湖海
            <br />
            却囿于昼夜厨房与爱
          </p>
        </div>

        {/* 快速导航 */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold tracking-wider text-primary/50 uppercase">Navigate</h3>
          <ul className="space-y-2">
            {FOOTER_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className="text-sm text-primary/70 transition-colors duration-200 hover:text-secondary"
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* 社交链接 + 主题切换 */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold tracking-wider text-primary/50 uppercase">Connect</h3>
          <div className="flex items-center gap-1">
            {socialIcons.map(icon => (
              <SocialIcon key={icon.platform} {...icon} />
            ))}
          </div>
          <div className="flex items-center gap-3 pt-2">
            <span className="text-sm text-primary/50">Theme</span>
            <ToggleDarkModeButton />
          </div>
        </div>
      </div>

      {/* 版权栏 */}
      <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-bgsecondary/30 pt-6 text-xs text-primary/40 md:flex-row">
        <p>© {year} HongWei&apos;s Blog. All rights reserved.</p>
        <p></p>
      </div>
    </footer>
  );
}

export default SiteFooter;
