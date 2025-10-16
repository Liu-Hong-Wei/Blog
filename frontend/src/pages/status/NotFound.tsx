import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-6xl mb-4">🤔</div>
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-8">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link to="/" className="text-blue-500 hover:underline">
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFound;
