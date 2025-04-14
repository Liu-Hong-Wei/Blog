import MainContent from "../components/MainContent";
import Sidebar from "../components/Sidebar";

function MainContentLayout() {
  return (
    <>
      <div className="w-full min-h-full flex justify-center py-4">
        <section className="w-full max-w-[1200px] flex flex-col md:flex-row min-h-full gap-6">
          <MainContent />
          <Sidebar />
        </section>
      </div>
    </>
  );
}

export default MainContentLayout;