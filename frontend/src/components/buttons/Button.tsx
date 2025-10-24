import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode,
    variant?: "primary" | "secondary",
    size?: "small" | "mid" | "large",
}

export default function Button({
    children = null,
    className = "",
    variant = "primary",
    size = "mid",
    onClick = () => { },
    disabled = false,
    ...props
}: ButtonProps) {
    const classes = `
    rounded-md transition-colors duration-300
    bg-transparent
    focus:outline-none hover:cursor-pointer
    ${className.includes("hidden") ? "" : "inline-flex items-center justify-center"}
    ${variant === "primary" && "text-primary "}
    ${variant === "secondary" && "text-secondary"}
    ${size === "small" && "h-8 p-2 text-base font-light "}
    ${size === "mid" && "h-12 p-2 text-lg font-normal "}
    ${size === "large" && "h-16 p-2 text-xl font-medium "}
    ${className}
    `;

    return (
        <button
            className={classes}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}