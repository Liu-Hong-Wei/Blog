import { NavLink } from "react-router";
import { NavLinks } from "./SiteHeader";

type MobileDrawerProps = {
  visible: boolean;
  active: boolean;
  onClose: () => void;
};

function MobileDrawer({ visible, active, onClose }: MobileDrawerProps) {
  if (!visible) {
    return null;
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-bgprimary/10 backdrop-blur-3xl util-transition ${
          active ? "opacity-100 pointer-events-auto" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        role="presentation"
      />
      <aside
        id="mobile-navigation"
        className={`fixed top-0 z-50 w-full rounded-b-xl bg-bgprimary/50 backdrop-blur-2xl shadow-md util-transition ${
          active ? "translate-y-0" : "-translate-y-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex h-12 items-center justify-center text-secondary">
          <NavLink to="/" className="text-2xl font-bold" onClick={onClose}>
            Ethan&apos;s Blog
          </NavLink>
        </div>
        <NavLinks orientation="vertical" className="px-6 pb-6" onNavigate={onClose} />
      </aside>
    </>
  );
}

export default MobileDrawer;