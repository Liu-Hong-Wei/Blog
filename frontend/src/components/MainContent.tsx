import { Outlet } from "react-router";

const MainContent = () => {
  return (
    <main className="w-full md:w-[742px] p-6 bg-white rounded-lg shadow-sm">
      <Outlet />
    </main>
  );
};

export default MainContent;