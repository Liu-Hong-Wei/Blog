import MeInTheForbiddenPalace from "../assets/images/Me-in-the-Forbidden-Palace.png";
import ContainerLayout from "../layouts/ContainerLayout";

function ProfileCard({className}: { className?: string; }) {
  return (
    <ContainerLayout className={className}>
      <div className="w-full flex flex-col">
        <div className="w-full max-w-[180px] mx-auto aspect-square my-8 select-none">
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
      </div>
    </ContainerLayout>
  )
}

export default ProfileCard;