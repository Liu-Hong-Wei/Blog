import ContainerLayout from "../layouts/ContainerLayout";
import Postslist from "./Postslist";

const MainSection = () => {
  return (
    <ContainerLayout className="md:w-[742px] p-4">
      <Postslist />
    </ ContainerLayout>
  );
};

export default MainSection;