import { Outlet, NavLink } from "react-router";
import { useState, useEffect } from "react";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
          <div className="w-2xl h-full flex justify-center">
            {
              // TODO: abstract component
            }
            <button
              className="md:hidden w-[40px] flex flex-col justify-center items-center  px-2"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <span className="block w-6 h-0.5 bg-gray-400 mb-1"></span>
              <span className="block w-6 h-0.5 bg-gray-400 mb-1"></span>
              <span className="block w-6 h-0.5 bg-gray-400"></span>
            </button>
            <header className="flex justify-center items-center mr-4 w-max md:mr-32">
              <h1 className="text-slate-700 font-bold">
                <NavLink to="/">Ethan's Blog</NavLink>
              </h1>
            </header>
            {/* 菜单按钮，仅在小屏显示 */}
            {/* 原有NavLink，仅在md及以上显示 */}
            <ul className="hidden md:flex w-3xs md:w-xs h-full *:grow *:rounded-lg *:p-2 justify-start text-center items-center gap-4 *:hover:bg-gray-100 *:hover:duration-200">
              {[
                { to: "/posts", text: "Posts" },
                { to: "/ideas", text: "Ideas" },
                { to: "/projects", text: "Projects" },
                { to: "/about", text: "About" }
              ].map(({ to, text }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) => isActive ? "text-slate-700 font-medium" : "text-slate-500"}
                  >
                    {text}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        {/* Drawer蒙层和侧边栏，仅在小屏幕下显示 */}
        {drawerOpen && (
          <>
            {/* 覆盖层 */}
            <div
              className="fixed inset-0 bg-black/5 backdrop-blur-sm z-40"
              onClick={() => setDrawerOpen(false)}
            ></div>
            {/* 侧边栏 */}
            <aside className="fixed top-0 left-0 h-full w-48 bg-bgprimary z-50 shadow-lg flex flex-col transition-transform duration-300">
              <div className="flex items-center justify-between h-16 px-4 border-b-1 border-gray-300">
                <NavLink
                  to="/"
                  onClick={() => setDrawerOpen(false)}
                >
                  <span className="text-lg font-bold">Ethan's Blog</span>
                </NavLink>
                <button
                  className="text-2xl"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                >
                  {/* 
                  &times; renders as a multiplication symbol (×)
                  It's an HTML entity commonly used for close/dismiss buttons
                  This creates a simple, clean "X" button for closing the drawer
                */}
                  &times;
                </button>
              </div>
              <ul className="h-full flex flex-col p-4">
                {[
                  { to: "/posts", text: "Posts" },
                  { to: "/ideas", text: "Ideas" },
                  { to: "/projects", text: "Projects" },
                  { to: "/about", text: "About" }
                ].map(({ to, text }) => (
                  <li className="pl-4 py-4 border-t-2 border-gray-300" key={to}>
                    <NavLink
                      to={to}
                      className={({ isActive }) => isActive ? "text-slate-700 font-medium" : "text-slate-500"}
                      onClick={() => setDrawerOpen(false)}
                    >
                      {text}
                    </NavLink>
                  </li>
                ))}
                <li className="pb-2 border-t-2 border-gray-300"></li>
              </ul>
            </aside>
          </>
        )}
        <div className="pt-16 min-h-screen flex flex-col bg-bgprimary">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Navbar;
