import MainContent from "../components/MainContent";
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
