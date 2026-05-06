import Error from './Error';

const UnderConstruction = ({ name }: { name: string }) => {
  return (
    <Error
      emoji="🚧"
      content={`${name} is under construction`}
      error="This page is being built with care. Check back soon!"
      showRefresh={false}
    />
  );
};

export default UnderConstruction;
