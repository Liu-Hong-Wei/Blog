import { Outlet, NavLink } from "react-router";
import { useState, useEffect, useRef, Suspense } from "react";

import { PageLoadingSpinner } from "../components/Spinners.tsx";
import { NavBarProps } from "../types/types";
import NavButton from "../components/buttons/NavButton";
import HamburgerIcon from "../components/icons/HamburgerIcon";
import ToggleDarkModeButton from "../components/buttons/ToggleDarkModeButton.tsx";

// 导航链接常量，避免在渲染期间重复创建
const NAV_LINKS = [
  { to: "/posts", text: "Posts" },
  { to: "/ideas", text: "Ideas" },
  { to: "/projects", text: "Projects" },
  { to: "/about", text: "About" }
];

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

function NavLinks({ onClick, className }: { onClick?: () => void, className?: string }) {
  return (
    <ul className={`flex text-2xl ${className}`}>
      {NAV_LINKS.map(({ to, text }) => (
        <li>
          <NavButton
            key={to}
            to={to}
            onClick={onClick}
            ariaLabel={`${text} link`}
          >
            {text}
          </NavButton>
        </li>
      ))}
    </ul>

  )
}

function NavBar({ setDrawerOpen, drawerVisible, drawerActive }: NavBarProps) {
  return (
    <>
      <nav className={`sticky top-2 mx-auto z-50 m-2 p-2 h-12 md:max-w-3xl w-full flex justify-between items-center backdrop-blur-sm bg-bgprimary/50 rounded-xl shadow-md transition-all duration-300`}>
        <header className="flex justify-center items-center">
          <NavLink
            className="text-2xl font-bold"
            to="/"
          >Ethan's Blog</NavLink>
        </header>
        <div className="flex ">
          {/* 原有NavLink，仅在md及以上显示 */}
          <NavLinks className="hidden md:flex h-full *:grow gap-4 " />
          <ToggleDarkModeButton />
          {/* 菜单按钮，仅在小屏显示 */}
          <NavButton
            onClick={() => setDrawerOpen(true)}
            className="md:hidden ml-2"
            ariaLabel="Open menu">
            <HamburgerIcon />
          </NavButton>
        </div>
      </nav >
      {/* Drawer蒙层和侧边栏，仅在小屏幕下显示（带动画）*/}
      {
        drawerVisible && (
          <>
            {/* 覆盖层：淡入淡出 */}
            <div
              className={`fixed inset-0 bg-bgprimary/10 backdrop-blur-3xl z-40 transition-opacity duration-300 ${drawerActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
              onClick={() => setDrawerOpen(false)}
            ></div>
            {/* 顶部下拉抽屉：从上方滑入/滑出 */}
            <aside className={`fixed top-0 w-full mx-auto z-50 backdrop-blur-2xl bg-bgprimary/50 rounded-b-xl shadow-md flex flex-col transition-transform duration-300 ${drawerActive ? '' : '-translate-y-full'}`}>
              <header className="flex justify-center items-center text-secondary h-12">
                <NavLink
                  to="/"
                  className="text-2xl font-bold"
                  onClick={() => setDrawerOpen(false)}
                >Ethan's Blog</NavLink>
              </header>
              <NavLinks onClick={() => setDrawerOpen(false)} className="flex-col gap-2" />
            </aside>
          </>
        )
      }</>
  )
}

// 监听滚动
// function useScrollShadow() {
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 0);
//     handleScroll();
//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return scrolled;
// }

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { visible: drawerVisible, active: drawerActive } = useDrawerTransition(drawerOpen, 300);
  useBodyScrollLock(drawerOpen);

  // TODO: 在阅读文章时，Ethan Blog 转成文章标题
  return (
    <>
      <div className="max-w-screen min-h-screen p-[0.05px] bg-bgprimary text-primary flex flex-col transition-colors duration-300"> {/* wrapper for the notch design */}
        <NavBar setDrawerOpen={setDrawerOpen} drawerVisible={drawerVisible} drawerActive={drawerActive} />
        <div className={`grow flex flex-col bg-bgprimary transition-colors duration-300`}>
          <Suspense fallback={<PageLoadingSpinner />}>
            <Outlet />
          </Suspense>
        </div >
      </div>
    </>
  );
}

export default Navbar;
