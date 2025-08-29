import classNames from "classnames";
import React, { useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";

interface iSelectedO {
    value: string;
    label: string;
}

interface SelectMenuProps {
    options: iSelectedO[];
    label: string;
    autoSelect?: boolean;
    onChange: (selectedOption: string) => void;
}

const SelectMenu: React.FC<SelectMenuProps> = ({
    options,
    label,
    onChange,
    autoSelect = false,
}) => {
    const [selectedOption, setSelectedOption] = useState<iSelectedO>(
        autoSelect ? options[0] : ({} as iSelectedO)
    );

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleOptionClick = (option: { value: string; label: string }) => {
        setSelectedOption(option);
        onChange(option?.value);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block w-full">
            <label className="block text-sm font-medium text-gray-700 sr-only">
                {label}
            </label>
            <button
                type="button"
                className={classNames(
                    "relative w-full",
                    "px-3 py-2",
                    "cursor-default",
                    "text-sm dark:text-white",
                    "rounded-md shadow-sm",
                    "border border-gray-300 dark:border-gray-700",
                    "dark:bg-shark-950",
                    "focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="w-full flex justify-between flex-nowrap items-center">
                    <h1 className="block truncate">
                        {selectedOption?.label || "Bir seçenek seç"}
                    </h1>
                    <span className="pointer-events-none">
                        <MdArrowForwardIos
                            className={classNames("text-gray-400", {
                                "rotate-90 text-indigo-500": isOpen,
                            })}
                        />
                    </span>
                </div>
            </button>
            {isOpen && (
                <ul className="absolute z-[99] mt-1 w-full bg-white dark:bg-shark-950 shadow-lg max-h-60 rounded-md py-1 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none text-sm">
                    {options.map((option, index) => (
                        <li
                            key={index}
                            className="group dark:text-white cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
                            onClick={() => handleOptionClick(option)}
                        >
                            <span
                                className={classNames("block truncate", {
                                    "font-semibold":
                                        selectedOption?.value === option.value,
                                    "font-normal":
                                        selectedOption?.value !== option.value,
                                })}
                            >
                                {option.label}
                            </span>
                            {selectedOption?.value === option.value && (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-hover:text-white">
                                    <svg
                                        className="h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-3.293-3.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SelectMenu;
