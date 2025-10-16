import { Link } from "react-router";

const Error = ({
    emoji = "👾",
    content = "Oops, something went wrong",
    error = ""
}: {
    emoji?: string;
    content?: string;
    error?: string;
}) => {
    return (
        <div className="h-fit p-16 flex flex-col items-center justify-center">
            <div className="text-6xl mb-4">{emoji}</div>
            <h1 className="text-4xl font-bold mb-4">
                {content}
                <span
                    onClick={() => {
                        window.location.reload();
                    }}
                    className="ml-4 text-secondary/60 hover:text-secondary hover:cursor-pointer"
                >
                    &#x27F3;
                </span>
            </h1>
            {error && (
                <p className="text-xl mb-4">
                    {error}
                </p>
            )}
            <Link to="/" className="text-secondary mt-4 hover:underline">
                Go to Homepage
            </Link>
        </div>
    );
};

export default Error;