import classNames from "classnames";

export default function Loading({
    className = "",
    w = 24,
    h = undefined,
}: {
    className?: string;
    w?: number;
    h?: number;
}) {
    return (
        <div role="spinbutton" className="flex">
            <span
                className={classNames(
                    "anim-loading",
                    "border-2 border-solid border-gray-200 border-b-royal-950 dark:border-b-FF3D00",
                    className
                )}
                style={{ width: w, height: h || w }}
            ></span>
            <span className="sr-only">Loading...</span>
        </div>
    );
}
