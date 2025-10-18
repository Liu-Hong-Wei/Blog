import Error from "./errors/Error";

function Homepage() {
  return (
    <>
      <Error emoji='🚧' content='Homepage is under construction' showRefresh={false} showGoHome={false} />
    </>
  );
}

export default Homepage;
