import ContainerLayout from "../layouts/ContainerLayout";
import Postlists from "./Postslist";

const MainSection = () => {
  return (
    <ContainerLayout className="md:w-[742px]" >
      <Postlists />
    </ ContainerLayout>
  );
};

export default MainSection;