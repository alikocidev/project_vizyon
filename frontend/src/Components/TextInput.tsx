import classNames from "classnames";
import { forwardRef, useEffect, useImperativeHandle, useRef, InputHTMLAttributes } from "react";

export default forwardRef(function TextInput(
  { type = "text", className = "", isFocused = false, ...props }: InputHTMLAttributes<HTMLInputElement> & { isFocused?: boolean },
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
        "outline-none ring-0",
        "focus:outline-none focus:ring-0",
        "placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:placeholder:text-transparent",
        "bg-light-primary dark:bg-dark-primary",
        "border-light-surface dark:border-dark-surface",
        "hover:border-primary dark:hover:border-secondary",
        "text-light-text dark:text-dark-text",
        "focus:border-primary dark:focus:border-secondary",
        className
      )}
      ref={localRef}
    />
  );
});
