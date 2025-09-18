import { Outlet, NavLink } from "react-router";
import { useState, useEffect, ReactNode } from "react";
import Button from "../components/Button";

function NavButton({ onClick, className, to, ariaLabel, children }:
  {
    onClick?: () => void
    className?: string
    to?: string
    ariaLabel: string
    children: ReactNode
  }
) {
  let child = children
  if (to) {
    child = <NavLink
      to={to}
      className={({ isActive }) => isActive ? "text-primary font-bold" : "text-primary/50"}
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

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navLinks = [
    { to: "/posts", text: "Posts" },
    { to: "/ideas", text: "Ideas" },
    { to: "/projects", text: "Projects" },
    { to: "/about", text: "About" }
  ]

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <>
      <div className="min-h-screen bg-bgprimary">
        <nav className={`h-16 fixed top-0 w-screen text-xl backdrop-blur-xl flex justify-center transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}>
          <header className="flex justify-center items-center mr-12 w-max md:mr-64">
            <div className="text-primary text-xl font-bold">
              <NavLink to="/">Ethan's Blog</NavLink>
            </div>
          </header>
          <NavButton
            onClick={() => setDrawerOpen(true)}
            className="md:hidden"
            ariaLabel="Open menu">
            <div className="flex flex-col justify-center items-center">
              <span className="block w-6 h-0.5 bg-gray-400 mb-1"></span>
              <span className="block w-6 h-0.5 bg-gray-400 mb-1"></span>
              <span className="block w-6 h-0.5 bg-gray-400"></span>
            </div>
          </NavButton>
          {/* 菜单按钮，仅在小屏显示 */}
          {/* 原有NavLink，仅在md及以上显示 */}
          <ul className="hidden md:flex h-full *:grow gap-4">
            {navLinks.map(({ to, text }) => (
              <NavButton
                key={to}
                to={to}
                ariaLabel={`${text} link`}
              >
                <li>
                  {text}
                </li>
              </NavButton>
            ))}
          </ul>
        </nav >
        {/* Drawer蒙层和侧边栏，仅在小屏幕下显示 */}
        {
          drawerOpen && (
            <>
              {/* 覆盖层 */}
              <div
                className="fixed inset-0 bg-bgsecondary/10 backdrop-blur-lg z-40"
                onClick={() => setDrawerOpen(false)}
              ></div>
              {/* 侧边栏 */}
              <aside className="fixed top-0 left-0 h-fit w-screen bg-bgprimary z-50 shadow-xl rounded-xl flex flex-col transition-transform duration-300">
                <header className="h-16 flex justify-center items-center">
                  <div className="text-secondary text-4xl font-bold">
                    <NavLink
                      to="/"
                      onClick={() => setDrawerOpen(false)}
                    >Ethan's Blog</NavLink>
                  </div>
                </header>
                <ul className="flex flex-col">
                  {navLinks.map(({ to, text }) => (
                    <NavButton
                      key={to}
                      to={to}
                      onClick={() => setDrawerOpen(false)}
                      ariaLabel={`${text} link`}
                    >
                      <li className="text-base">
                        {text}
                      </li>
                    </NavButton>
                  ))}
                </ul>
              </aside>
            </>
          )
        }
        <div className="pt-16 min-h-screen flex flex-col bg-bgprimary">
          <Outlet />
        </div>
      </div >
    </>
  );
}

export default Navbar;
