import Error from './Error';

const NotFound = () => {
  return (
    <Error
      emoji="🔍"
      content="404 - Page Not Found"
      error="The page you're looking for doesn't exist or has been moved."
      showGoBack
    />
  );
};

export default NotFound;
