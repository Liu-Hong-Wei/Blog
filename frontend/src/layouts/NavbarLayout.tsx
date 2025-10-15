import { Outlet, NavLink } from "react-router";
import { useState, useEffect, useRef } from "react";

import { NavBarProps } from "../types/types";
import NavButton from "../components/buttons/NavButton";
import HamburgerIcon from "../components/icons/HamburgerIcon";

// 导航链接常量，避免在渲染期间重复创建
const NAV_LINKS = [
  { to: "/posts", text: "Posts" },
  { to: "/ideas", text: "Ideas" },
  { to: "/projects", text: "Projects" },
  { to: "/about", text: "About" }
];

function NavLinks({ onClick, className }: { onClick?: () => void, className?: string }) {
  return (
    <ul className={`flex ${className}`}>
      {NAV_LINKS.map(({ to, text }) => (
        <NavButton
          key={to}
          to={to}
          onClick={onClick}
          ariaLabel={`${text} link`}
        >
          <li>
            {text}
          </li>
        </NavButton>
      ))}
    </ul>

  )
}

function NavBar({ setDrawerOpen, drawerVisible, drawerActive }: NavBarProps) {
  return (
    <>
      <nav className={`fixed top-0 w-screen text-xl backdrop-blur-3xl `}>
        <section className="flex justify-evenly items-center md:max-w-5xl mx-auto md:h-fit h-16">
          <header className="flex justify-center items-center">
            <NavLink
              className="text-primary text-xl font-bold"
              to="/"
            >Ethan's Blog</NavLink>
          </header>
          <NavButton
            onClick={() => setDrawerOpen(true)}
            className="md:hidden"
            ariaLabel="Open menu">
            {/* 菜单按钮，仅在小屏显示 */}
            <HamburgerIcon />
          </NavButton>
          {/* 原有NavLink，仅在md及以上显示 */}
          <NavLinks className="hidden md:flex h-full *:grow gap-4" />
        </section>
      </nav >
      {/* Drawer蒙层和侧边栏，仅在小屏幕下显示（带动画）*/}
      {
        drawerVisible && (
          <>
            {/* 覆盖层：淡入淡出 */}
            <div
              className={`fixed inset-0 bg-bgsecondary/10 backdrop-blur-xl z-40 transition-opacity duration-300 ${drawerActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
              onClick={() => setDrawerOpen(false)}
            ></div>
            {/* 顶部下拉抽屉：从上方滑入/滑出 */}
            <aside className={`fixed top-0 left-0 w-screen z-50 shadow-xl rounded-b-xl flex flex-col bg-bgprimary transition-transform duration-300 ${drawerActive ? '' : '-translate-y-full'}`}>
              <header className="flex justify-center items-center h-16 border-b-2 border-bgsecondary">
                <NavLink
                  to="/"
                  className="text-secondary text-2xl font-bold"
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

// 监听滚动以切换阴影
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
  const { visible: drawerVisible, active: drawerActive } = useDrawerTransition(drawerOpen, 300);
  useBodyScrollLock(drawerOpen);

  // TODO: 在阅读文章时，Ethan Blog 转成文章标题
  return (
    <>
      <NavBar setDrawerOpen={setDrawerOpen} drawerVisible={drawerVisible} drawerActive={drawerActive} />
      <div className="min-h-screen bg-bgprimary">
        <div className={`pt-16 h-screen flex flex-col bg-bgprimary`}>
          <Outlet />
        </div>
      </div >
    </>
  );
}

export default Navbar;
