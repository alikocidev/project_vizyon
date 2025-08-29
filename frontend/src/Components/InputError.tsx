import classNames from "classnames";
import { HTMLAttributes } from "react";

export default function InputError({
    message,
    className = "",
    ...props
}: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
    return message ? (
        <p
            {...props}
            className={classNames("text-sm text-red-600 dark:text-red-400 ")}
        >
            {message}
        </p>
    ) : null;
}
