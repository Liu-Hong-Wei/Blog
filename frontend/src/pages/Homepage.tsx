import ProfileCard from '../components/ProfileCard';
import MainContentLayout from '../layouts/MainContentLayout';

function Homepage() {
  return (
    <>
      <MainContentLayout widthSize="wide">
        <ProfileCard />
      </MainContentLayout>
    </>
  );
}

export default Homepage;
