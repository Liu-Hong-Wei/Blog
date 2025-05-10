import ContainerLayout from "../layouts/ContainerLayout";
import MeInTheForbiddenPalace from "../assets/images/Me-in-the-Forbidden-Palace.png";

function Sidebar() {
  return (
    <ContainerLayout className="md:w-[458px] bg-slate-500">
      <div className="w-full max-w-[200px] mx-auto aspect-square mb-4">
        <img
          src={MeInTheForbiddenPalace}
          alt="me in the forbidden palace"
          className="w-full h-full object-cover shadow-xl rounded-full"
          loading="lazy"
        />
      </div>
      <h1 className="text-center text-xl">👋Hi, there! I'm Liu Hongwei</h1>
    </ContainerLayout>
  );
};

export default Sidebar;