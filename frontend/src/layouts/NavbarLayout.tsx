import { Outlet, NavLink } from "react-router";
import { useState, useEffect, ReactNode, useRef } from "react";
import Button from "../components/Button";

// 导航链接常量，避免在渲染期间重复创建
const NAV_LINKS = [
  { to: "/posts", text: "Posts" },
  { to: "/ideas", text: "Ideas" },
  { to: "/projects", text: "Projects" },
  { to: "/about", text: "About" }
];

type NavButtonProps = {
  onClick?: () => void;
  className?: string;
  to?: string;
  ariaLabel: string;
  children: ReactNode;
};

function NavButton({ onClick, className, to, ariaLabel, children }: NavButtonProps) {
  let child = children
  if (to) {
    child = <NavLink
      to={to}
      className={({ isActive }) => isActive ? "text-primary font-bold no-underline" : "text-primary/50 hover:underline hover:underline-offset-2"}
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

function HamburgerIcon() {
  return (
    <div className="flex flex-col justify-center items-center">
      <span className="block w-6 h-0.5 bg-gray-400 mb-1"></span>
      <span className="block w-6 h-0.5 bg-gray-400 mb-1"></span>
      <span className="block w-6 h-0.5 bg-gray-400"></span>
    </div>
  );
}

// 监听滚动以切换阴影
function useScrollShadow() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrolled;
}

// 控制抽屉的挂载与动画：打开立即挂载，关闭延迟卸载
function useDrawerTransition(isOpen: boolean, delayMs = 300) {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      // 下一帧再激活，让 CSS 过渡有起点（translate-y-full -> 0）
      const timer = setTimeout(() => setActive(true), 100);
      return () => clearTimeout(timer);
    }
    // 先去激活，等待过渡结束后再卸载
    setActive(false);
    const timer = setTimeout(() => setVisible(false), delayMs);
    return () => clearTimeout(timer);
  }, [isOpen, delayMs]);

  return { visible, active };
}

// 锁定/恢复滚动并保留原滚动位置
function useBodyScrollLock(locked: boolean) {
  const scrollYRef = useRef(0);

  useEffect(() => {
    const body = document.body as HTMLBodyElement;
    if (locked) {
      scrollYRef.current = window.scrollY;
      body.style.position = "fixed";
      body.style.top = `-${scrollYRef.current}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.style.overflow = "hidden";
    } else {
      const top = body.style.top;
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";
      if (top) {
        const y = Math.abs(parseInt(top) || 0);
        window.scrollTo(0, y);
      }
    }
  }, [locked]);
}

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const scrolled = useScrollShadow();
  const { visible: drawerVisible, active: drawerActive } = useDrawerTransition(drawerOpen, 1000);
  useBodyScrollLock(drawerOpen);

  return (
    <>
      <div className="min-h-screen bg-bgprimary">
        <nav className={`h-16 fixed top-0 w-screen text-xl backdrop-blur-md flex justify-center transition-shadow duration-500 ${scrolled ? 'shadow-md' : ''}`}>
          <header className="flex justify-center items-center mr-12 w-max md:mr-64">
            <div className="text-primary text-xl font-bold">
              <NavLink to="/">Ethan's Blog</NavLink>
            </div>
          </header>
          <NavButton
            onClick={() => setDrawerOpen(true)}
            className="md:hidden"
            ariaLabel="Open menu">
            <HamburgerIcon />
          </NavButton>
          {/* 菜单按钮，仅在小屏显示 */}
          {/* 原有NavLink，仅在md及以上显示 */}
          <ul className="hidden md:flex h-full *:grow gap-4">
            {NAV_LINKS.map(({ to, text }) => (
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
        {/* Drawer蒙层和侧边栏，仅在小屏幕下显示（带动画）*/}
        {drawerVisible && (
          <>
            {/* 覆盖层：淡入淡出 */}
            <div
              className={`fixed inset-0 bg-bgsecondary/10 backdrop-blur-xl z-40 transition-opacity duration-500 ${drawerActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
              onClick={() => setDrawerOpen(false)}
            ></div>
            {/* 顶部下拉抽屉：从上方滑入/滑出 */}
            <aside className={`fixed top-0 left-0 w-screen z-50 shadow-xl rounded-b-xl flex flex-col bg-bgprimary transition-transform duration-200 ${drawerActive ? '' : '-translate-y-full'}`}>
              <header className="h-16 flex justify-center items-center">
                <div className="text-secondary text-2xl font-bold">
                  <NavLink
                    to="/"
                    onClick={() => setDrawerOpen(false)}
                  >Ethan's Blog</NavLink>
                </div>
              </header>
              <ul className="flex flex-col">
                {NAV_LINKS.map(({ to, text }) => (
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
        )}
        <div className={`pt-16 min-h-screen flex flex-col bg-bgprimary`}>
          <Outlet />
        </div>
      </div >
    </>
  );
}

export default Navbar;
