import MainContent from "../components/MainSection";
import Sidebar from "../components/Sidebar";
import MainContentLayout from "../layouts/MainContentLayout";

function Homepage() {
  return (
    <MainContentLayout>
      <MainContent />
      <Sidebar />
    </MainContentLayout>
  );
}

export default Homepage;
