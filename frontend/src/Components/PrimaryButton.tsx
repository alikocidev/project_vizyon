import classNames from "classnames";
import { ButtonHTMLAttributes } from "react";

export default function PrimaryButton({
    className = "",
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={classNames(
                "inline-flex items-center justify-center",
                "px-4 py-2",
                "border border-transparent rounded",
                "shadow",
                "text-xs uppercase tracking-widest",
                "text-F7F2EB dark:text-FFF2D7",
                "bg-royal-950 dark:bg-lotus-700",
                "hover:bg-royal-900 dark:hover:bg-lotus-600 focus:bg-royal-900 dark:focus:bg-lotus-600",
                "active:bg-royal-900 focus:outline-none",
                "focus:ring-2 focus:ring-offset-2 focus:ring-royal-900 dark:focus:ring-copper-rose-600 focus:ring-offset-F7F2EB dark:focus:ring-offset-111216",
                "transition ease-in-out duration-150",
                "disabled:opacity-25",
                className
            )}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
