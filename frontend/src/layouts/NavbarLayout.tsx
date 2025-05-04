import { Outlet, NavLink } from "react-router";
import { useState, useEffect } from "react";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

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
      <nav className={`h-16 fixed top-0 w-screen text-xl bg-white/90 backdrop-blur-xl flex justify-center transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}>
        <div className="w-2xl h-full flex justify-center">
          <header className="flex justify-center items-center mr-4 w-max md:mr-32">
            <h1 className="text-slate-700 font-bold">
              <NavLink to="/">Ethan's Blog</NavLink>
            </h1>
          </header>
          <ul className="w-3xs md:w-xs h-full *:grow *:rounded-lg *:p-2 flex justify-start text-center items-center gap-4 *:hover:bg-slate-100 *:hover:duration-200">
            <li>
              <NavLink to="/posts" className={({isActive}) => isActive ? "text-blue-400 font-medium" : ""}>Posts</NavLink>
            </li>
            <li>
              <NavLink to="/archives" className={({isActive}) => isActive ? "text-blue-400 font-medium" : ""}>Archives</NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({isActive}) => isActive ? "text-blue-400 font-medium" : ""}>About</NavLink>
            </li>
          </ul>
        </div>
      </nav>
      <div className="pt-16 h-screen">
        <Outlet />
      </div>
    </>
  );
}

export default Navbar;
