import { Outlet } from "react-router";
import ContainerLayout from "../layouts/ContainerLayout";

const MainContent = () => {
  return (
    <ContainerLayout className="md:w-[742px]" >
      <Outlet />
    </ ContainerLayout>
  );
};

export default MainContent;