import { ReactNode } from "react";

interface ButtonProps {
    children?: ReactNode,
    className?: string,
    variant?: "primary" | "secondary",
    size?: "small" | "mid" | "large",
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void,
    disabled?: boolean,
    prop?: React.ButtonHTMLAttributes<HTMLButtonElement>
}

export default function Button({
    children = null,
    className = "",
    variant = "primary",
    size = "mid",
    onClick = () => { },
    disabled = false,
    ...prop
}: ButtonProps) {
    const classes = `
    ${className}
    inline-flex items-center justify-center
    rounded-md transition-colors duration-300
    bg-transparent
    focus:outline-none hover:cursor-pointer
    ${variant === "primary" && "text-primary "}
    ${variant === "secondary" && "text-secondary"}
    ${size === "small" && "h-8 p-2 text-base font-light "}
    ${size === "mid" && "h-12 p-2 text-lg font-normal "}
    ${size === "large" && "h-16 p-2 text-xl font-medium "}
    `;

    return (
        <button
            className={classes}
            onClick={onClick}
            disabled={disabled}
            {...prop}
        >
            {children}
        </button>
    );
}