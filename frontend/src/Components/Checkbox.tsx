import classNames from "classnames";
import { InputHTMLAttributes } from "react";

export default function Checkbox({
    className = "",
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            type="checkbox"
            className={classNames(
                "rounded shadow-sm cursor-pointer",
                "bg-white dark:bg-shark-950",
                "border-shark-200 dark:border-shark-800",
                "text-royal-950 dark:text-lotus-600",
                "focus:ring-royal-950 dark:focus:ring-lotus-600 focus:ring-offset-F7F2EB dark:focus:ring-offset-111216",
                "checked:!bg-royal-950 dark:checked:!bg-lotus-600 dark:checked:!border-lotus-600",
                className
            )}
        />
    );
}
