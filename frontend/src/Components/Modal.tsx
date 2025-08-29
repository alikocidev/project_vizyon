import { Fragment, PropsWithChildren } from "react";
import { Dialog, Transition } from "@headlessui/react";
import classNames from "classnames";

export default function Modal({
    children,
    show = false,
    closeable = true,
    onClose = () => {},
    className = "",
}: PropsWithChildren<{
    show: boolean;
    closeable?: boolean;
    onClose: CallableFunction;
    className?: string;
}>) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    return (
        <Transition show={show} as={Fragment} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="z-[999] fixed inset-0 flex overflow-y-auto px-4 py-6 items-center transform transition-all"
                onClose={close}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="absolute inset-0 bg-gray-500/75 dark:bg-shark-950/90" />
                </Transition.Child>

                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <Dialog.Panel
                        className={classNames(
                            "bg-white dark:bg-0F0E0E",
                            "rounded-lg",
                            "overflow-hidden",
                            "shadow-xl",
                            "transform transition-all",
                            "w-full mx-auto",
                            className
                        )}
                    >
                        {children}
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}
