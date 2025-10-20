import ProfileCard from "../components/ProfileCard";
import { ComponentLoadingSpinner } from "../components/Spinners";
import SuspenseErrorBoundary from "../components/SuspenseErrorBoundary";
import MainContentLayout from "../layouts/MainContentLayout";

function About() {
  return (
    <MainContentLayout>
      <SuspenseErrorBoundary fallback={<ComponentLoadingSpinner />}>
        <ProfileCard />
      </SuspenseErrorBoundary>
    </MainContentLayout>
  );
}
export default About;
