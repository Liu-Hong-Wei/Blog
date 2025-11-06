import { Link, useNavigate } from "react-router";

const Error = ({
    emoji = "👾",
    content = "Oops, something went wrong",
    error = "",
    showRefresh = true,
    showGoHome = true,
    showGoBack = false,
}: {
    emoji?: string;
    content?: string;
    error?: string;
    showRefresh?: boolean;
    showGoBack?: boolean;
    showGoHome?: boolean;
}) => {
    const navigate = useNavigate();

    return (
        <div className="size-full p-16 flex flex-col items-center justify-center">
            <div className="text-6xl mb-4">{emoji}</div>
            <h1 className="text-4xl font-bold mb-4">
                {content}
                {showRefresh && (
                    <button
                        type="button"
                        onClick={() => {
                            window.location.reload();
                        }}
                        aria-label="Refresh page"
                        className="ml-4 text-secondary/60 hover:text-secondary focus:outline-none focus:ring-2 focus:ring-secondary rounded"
                    >
                        &#x27F3;
                    </button>
                )}
            </h1>
            {error && (
                <p className="text-xl mb-4">
                    {error}
                </p>
            )}
            {showGoHome && (
            <Link to="/" className="text-secondary mt-4 hover:underline">
                Go to Homepage
            </Link>)}
            {showGoBack && (
                <button onClick={() => navigate(-1)} className="text-secondary mt-4 hover:underline">
                    Go Back
                </button>
            )}
        </div>
    );
};

export default Error;