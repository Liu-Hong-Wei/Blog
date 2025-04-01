function Navbar({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="h-16 fixed top-0 w-screen shadow-lg text-xl bg-amber-100 flex justify-center">
        <div className="w-2xl h-full flex justify-center">
          <header className="flex justify-center items-center mr-4 w-max md:mr-32">
            <h1 className="text-[#50d71e]">
              <a href="/">Ethan's Blog</a>
            </h1>
          </header>
          <ul className="w-3xs md:w-xs h-full *:grow *:rounded-lg *:p-2 flex justify-start text-center items-center gap-4 *:hover:bg-amber-200 *:hover:duration-200">
            <li>
              <a href="#">Posts</a>
            </li>
            <li>
              <a href="#">Archives</a>
            </li>
            <li>
              <a href="#">About</a>
            </li>
          </ul>
        </div>
      </nav>
      <div className="pt-16 h-screen">{children}</div>
    </>
  );
}

export default Navbar;
