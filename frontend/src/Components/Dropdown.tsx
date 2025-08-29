import {
    useState,
    createContext,
    useContext,
    Fragment,
    PropsWithChildren,
    Dispatch,
    SetStateAction,
} from "react";
import { Link, InertiaLinkProps } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import classNames from "classnames";

const DropDownContext = createContext<{
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    toggleOpen: () => void;
}>({
    open: false,
    setOpen: () => {},
    toggleOpen: () => {},
});

const Dropdown = ({ children }: PropsWithChildren) => {
    const [open, setOpen] = useState(false);

    const toggleOpen = () => {
        setOpen((previousState) => !previousState);
    };

    return (
        <DropDownContext.Provider value={{ open, setOpen, toggleOpen }}>
            <div className="relative">{children}</div>
        </DropDownContext.Provider>
    );
};

const Trigger = ({ children }: PropsWithChildren) => {
    const { open, setOpen, toggleOpen } = useContext(DropDownContext);

    return (
        <>
            <div onClick={toggleOpen}>{children}</div>

            {open && (
                <div
                    className="fixed inset-0 z-[101]"
                    onClick={() => setOpen(false)}
                ></div>
            )}
        </>
    );
};

const Content = ({
    align = "right",
    width = "48",
    contentClasses = "",
    children,
}: PropsWithChildren<{
    align?: "left" | "right";
    width?: "48" | "w-full" | string;
    contentClasses?: string;
}>) => {
    const { open, setOpen } = useContext(DropDownContext);

    let alignmentClasses = "origin-top";

    if (align === "left") {
        alignmentClasses = "ltr:origin-top-left rtl:origin-top-right start-0";
    } else if (align === "right") {
        alignmentClasses = "ltr:origin-top-right rtl:origin-top-left end-0";
    }

    let widthClasses = "";

    if (width === "48") {
        widthClasses = "w-48";
    } else {
        widthClasses = width;
    }

    return (
        <>
            <Transition
                as={Fragment}
                show={open}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div
                    className={classNames(
                        "absolute z-[101] mt-2 shadow-lg",
                        alignmentClasses,
                        widthClasses
                    )}
                    onClick={() => setOpen(false)}
                >
                    <div
                        className={classNames(
                            "rounded-md ring-0",
                            "bg-white dark:bg-0F0E0E border dark:border-0F0E0E py-2",
                            contentClasses
                        )}
                    >
                        {children}
                    </div>
                </div>
            </Transition>
        </>
    );
};

const DropdownLink = ({
    className = "",
    children,
    ...props
}: InertiaLinkProps) => {
    return (
        <Link
            {...props}
            className={classNames(
                "block w-full px-3 py-2",
                "text-start text-sm leading-5",
                "hover:bg-royal-950 dark:hover:bg-lotus-700",
                "hover:text-white dark:text-white",
                "focus:outline-none",
                "transition duration-150 ease-in-out",
                className
            )}
        >
            {children}
        </Link>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;
