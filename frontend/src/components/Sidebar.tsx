import ContainerLayout from "../layouts/ContainerLayout";
import MeInTheForbiddenPalace from "../assets/images/Me-in-the-Forbidden-Palace.png";

function Sidebar() {
  return (
    <ContainerLayout className="md:w-[458px] bg-slate-500">
      <div className="w-full max-w-[200px] mx-auto aspect-square my-8">
        <img
          src={MeInTheForbiddenPalace}
          alt="me in the forbidden palace"
          className="w-full h-full object-cover shadow-lg rounded-full"
          loading="lazy"
          onContextMenu={e => e.preventDefault()}
          draggable="false"
        />
      </div>
      <h1 className="text-center text-xl mb-2">👋 Hi there! I'm Liu Hongwei</h1>
      <h1 className="text-center text-xl mb-2">🎓 Currently studying at CUC</h1>
      <h1 className="text-center text-xl mb-2">📚 Passionate about learning</h1>
      <h1 className="text-center text-xl mb-2">💻 Self-taught developer</h1>
    </ContainerLayout>
  );
};

export default Sidebar;