import Error from "./Error";

const UnderConstruction = ({name} : {name: string}) => {
  return (
      <Error emoji='🚧' content={`${name} is under construction`} showRefresh={false} showGoHome={false} />
  );
};

export default UnderConstruction;
