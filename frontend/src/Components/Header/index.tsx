import { useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { HiMiniBars3BottomRight } from "react-icons/hi2";
import { IoCloseOutline } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai";
import { User } from "@/types";
import useTheme from "@/Hooks/theme/useTheme";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import { HeaderItems } from "@/Components/Header/items";

export default function Header({
    user,
    title,
}: {
    user?: User;
    title: string;
}) {
    const { theme, toggleTheme } = useTheme();
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const MobileMenuButton = () => (
        <button
            onClick={() =>
                setShowingNavigationDropdown(!showingNavigationDropdown)
            }
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
            <Head title={title} />
            <header
                className={classNames(
                    "fixed",
                    "w-full h-16",
                    "p-4",
                    "z-[100]",
                    "bg-royal-950 dark:bg-lotus-700"
                )}
            >
                <div
                    className={classNames(
                        "w-full h-full mx-auto flex items-center gap-8",
                        "xl:w-2/3 lg:w-3/4"
                    )}
                >
                    <div className="flex items-center gap-2">
                        <Link
                            href="/"
                            className="flex items-center gap-2 ring-0 focus:outline-white focus:rounded-sm active:outline-none"
                        >
                            <ApplicationLogo className="block h-9 w-auto fill-F7F2EB dark:fill-FFF2D7" />
                            <h1 className="text-F7F2EB dark:text-FFF2D7 font-bold text-lg">
                                {import.meta.env.VITE_APP_NAME}
                            </h1>
                        </Link>
                    </div>
                    <div className="flex items-center gap-8 max-sm:hidden">
                        {HeaderItems.map(
                            (item, i) =>
                                !item.isMobile && (
                                    <Link
                                        key={i}
                                        href={route(item.href)}
                                        className={classNames(
                                            "flex items-center gap-2 outline-none ring-0 border-b border-transparent transition-colors",
                                            "hover:border-white dark:hover:border-FFF2D7"
                                        )}
                                    >
                                        <h1 className="text-F7F2EB dark:text-FFF2D7 font-bold transition-none">
                                            {item.label}
                                        </h1>
                                    </Link>
                                )
                        )}
                    </div>
                    <div className="ml-auto flex items-center gap-4 w-min whitespace-nowrap">
                        <button className="w-5 group" onClick={toggleTheme}>
                            {theme == "dark" ? (
                                <MdDarkMode className="text-white dark:text-current w-full h-full transition-transform duration-[1.5s] group-hover:rotate-[360deg]" />
                            ) : (
                                <MdLightMode className="text-white dark:text-FFF2D7 w-full h-full transition-transform duration-[1.5s] group-hover:rotate-180" />
                            )}
                        </button>
                        {user && (
                            <div className="hidden sm:flex sm:items-center ms-2">
                                <div className="relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white dark:text-FFF2D7 focus:outline-none transition ease-in-out duration-150"
                                                >
                                                    {user.name}
                                                    <svg
                                                        className="ms-2 -me-0.5 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content align="right">
                                            <Dropdown.Link
                                                href={route("profile.edit")}
                                            >
                                                <div className="flex items-center gap-1">
                                                    <AiOutlineUser className="w-4 h-4" />
                                                    <h1>Profil</h1>
                                                </div>
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                            >
                                                <div className="flex items-center gap-1">
                                                    <FiLogOut className="h-4 w-4" />
                                                    <h1>Çıkış yap</h1>
                                                </div>
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>
                        )}
                        {!user && (
                            <div className="hidden sm:flex items-center gap-4">
                                <NavLink
                                    as="button"
                                    href={route("login")}
                                    className="!text-white dark:!text-FFF2D7 hover:!border-white dark:hover:!border-FFF2D7 border-b border-transparent focus:!border-white dark:focus:!border-FFF2D7"
                                >
                                    <h1 className="text-sm">Giriş yap</h1>
                                </NavLink>
                                <NavLink
                                    as="button"
                                    href={route("register")}
                                    className="!text-white dark:!text-FFF2D7 hover:!border-white dark:hover:!border-FFF2D7 border-b border-transparent focus:!border-white dark:focus:!border-FFF2D7"
                                >
                                    <h1 className="text-sm">Kayıt Ol</h1>
                                </NavLink>
                            </div>
                        )}
                        <div className="flex items-center sm:hidden">
                            <MobileMenuButton />
                        </div>
                    </div>
                </div>
            </header>
            {/* Mobile */}
            <div className={classNames("fixed sm:hidden z-[99] w-full")}>
                <div
                    className={classNames(
                        "absolute w-full p-1 py-3 shadow border-b transition-[opacity,transform] duration-200 mt-16",
                        "bg-F7F2EB dark:bg-111216 dark:border-copper-rose-600 border-royal-950",
                        {
                            "opacity-0 -translate-y-full":
                                !showingNavigationDropdown,
                            "opacity-100 translate-y-0":
                                showingNavigationDropdown,
                        }
                    )}
                >
                    {user && (
                        <>
                            <div className="px-4 border-l-2 border-royal-950 dark:border-lotus-700">
                                <div className="font-medium text-gray-600 dark:text-FFF2D7 text-sm">
                                    {user.name}
                                </div>
                                <div className="font-medium text-sm text-gray-400">
                                    {user.email}
                                </div>
                            </div>

                            <div className="my-2 space-y-2">
                                <ResponsiveNavLink
                                    href={route("profile.edit")}
                                    className="border-l-2 border-royal-950 dark:border-lotus-700 flex items-center gap-1"
                                >
                                    <AiOutlineUser />
                                    <h1>Profil</h1>
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    method="post"
                                    href={route("logout")}
                                    as="button"
                                    className="border-l-2 border-royal-950 dark:border-lotus-700"
                                >
                                    Çıkış yap
                                </ResponsiveNavLink>
                            </div>
                        </>
                    )}
                    {!user && (
                        <div className="my-2 space-y-2">
                            <ResponsiveNavLink
                                href={route("login")}
                                className="border-l-2 border-royal-950 dark:border-lotus-700"
                            >
                                <h1>Giriş Yap</h1>
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                href={route("register")}
                                className="border-l-2 border-royal-950 dark:border-lotus-700"
                            >
                                <h1>Kayıt Ol</h1>
                            </ResponsiveNavLink>
                        </div>
                    )}
                    <hr className="border-gray-300 dark:border-lotus-700/50" />
                    <div className="space-y-2 mt-2">
                        {HeaderItems.map((item, i) => (
                            <ResponsiveNavLink
                                key={i}
                                href={route(item.href)}
                                className="border-l-2 border-royal-950 dark:border-lotus-700 flex items-center gap-2"
                            >
                                <item.icon />
                                <h1>{item.label}</h1>
                            </ResponsiveNavLink>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
