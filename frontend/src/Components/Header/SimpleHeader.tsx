import { useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { HiMiniBars3BottomRight } from "react-icons/hi2";
import { IoCloseOutline } from "react-icons/io5";
import { User } from "@/types";
import useTheme from "@/Hooks/theme/useTheme";
import ApplicationLogo from "@/Components/ApplicationLogo";

export default function SimpleHeader({
    user,
    title,
}: {
    user?: User;
    title: string;
}) {
    const { theme, toggleTheme } = useTheme();
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const MobileMenuButton = () => (
        <button
            onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
            className="inline-flex items-center justify-center rounded text-white dark:text-FFF2D7 focus:outline-none hover:bg-white/20 dark:hover:bg-white/10 focus:text-white dark:focus:text-FFF2D7 sm:transition"
        >
            <HiMiniBars3BottomRight
                className={classNames("w-6 h-6", {
                    hidden: showingNavigationDropdown,
                    "inline-flex": !showingNavigationDropdown,
                })}
            />
            <IoCloseOutline
                className={classNames("w-6 h-6", {
                    hidden: !showingNavigationDropdown,
                    "inline-flex": showingNavigationDropdown,
                })}
            />
        </button>
    );

    return (
        <>
            <title>{title}</title>
            <div className="min-h-screen bg-white dark:bg-gray-900">
                <nav className={classNames(
                    "bg-white dark:bg-shark-950 border-b border-gray-100 dark:border-gray-700",
                    "fixed top-0 w-full z-50"
                )}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                <div className="shrink-0 flex items-center">
                                    <Link to="/" className="flex items-center gap-2">
                                        <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                                        <span className="font-bold text-xl text-gray-800 dark:text-gray-200">
                                            Project Vizyon
                                        </span>
                                    </Link>
                                </div>

                                <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                    <Link
                                        to="/"
                                        className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700 transition duration-150 ease-in-out"
                                    >
                                        Ana Sayfa
                                    </Link>
                                    <Link
                                        to="/discover"
                                        className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700 transition duration-150 ease-in-out"
                                    >
                                        Keşfet
                                    </Link>
                                    <Link
                                        to="/movies/theaters"
                                        className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700 transition duration-150 ease-in-out"
                                    >
                                        Vizyondakiler
                                    </Link>
                                </div>
                            </div>

                            <div className="hidden sm:flex sm:items-center sm:ml-6">
                                <button
                                    onClick={toggleTheme}
                                    className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 transition duration-150 ease-in-out"
                                >
                                    {theme === 'dark' ? (
                                        <MdLightMode className="h-5 w-5" />
                                    ) : (
                                        <MdDarkMode className="h-5 w-5" />
                                    )}
                                </button>

                                {user ? (
                                    <div className="ml-3 relative">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            Hoş geldin, {user.name}!
                                        </span>
                                    </div>
                                ) : (
                                    <div className="ml-3 space-x-2">
                                        <Link
                                            to="/login"
                                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                        >
                                            Giriş
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="ml-4 inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                                        >
                                            Kayıt
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <div className="-mr-2 flex items-center sm:hidden">
                                <MobileMenuButton />
                            </div>
                        </div>
                    </div>

                    <div className={classNames("sm:hidden", {
                        block: showingNavigationDropdown,
                        hidden: !showingNavigationDropdown,
                    })}>
                        <div className="pt-2 pb-3 space-y-1">
                            <Link
                                to="/"
                                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-800 dark:focus:text-gray-200 focus:bg-gray-50 dark:focus:bg-gray-700 focus:border-gray-300 dark:focus:border-gray-600 transition duration-150 ease-in-out"
                            >
                                Ana Sayfa
                            </Link>
                            <Link
                                to="/discover"
                                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-800 dark:focus:text-gray-200 focus:bg-gray-50 dark:focus:bg-gray-700 focus:border-gray-300 dark:focus:border-gray-600 transition duration-150 ease-in-out"
                            >
                                Keşfet
                            </Link>
                        </div>
                    </div>
                </nav>
            </div>
        </>
    );
}
