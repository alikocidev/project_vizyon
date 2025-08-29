import classNames from "classnames";
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    InputHTMLAttributes,
} from "react";

export default forwardRef(function TextInput(
    {
        type = "text",
        className = "",
        isFocused = false,
        ...props
    }: InputHTMLAttributes<HTMLInputElement> & { isFocused?: boolean },
    ref
) {
    const localRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, []);

    return (
        <input
            {...props}
            type={type}
            className={classNames(
                "dark:border-gray-700",
                "dark:bg-shark-950",
                "dark:text-gray-100",
                "outline-none ring-0",
                "focus:outline-none focus:ring-0",
                "focus:border-indigo-500 dark:focus:border-indigo-500",
                className
            )}
            ref={localRef}
        />
    );
});
