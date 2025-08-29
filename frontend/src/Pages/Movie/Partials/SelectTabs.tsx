import { Link } from "@inertiajs/react";
import classNames from "classnames";

export default function SelectTabs() {
    interface iItem {
        label: string;
        href: string;
    }

    const Items: iItem[] = [
        { label: "Vizyondakiler", href: "movie.theaters" },
        { label: "Çok Yakında", href: "movie.upcomings" },
        { label: "Popüler", href: "movie.popular" },
        { label: "Son Trendler", href: "movie.trending" },
        { label: "En İyiler", href: "movie.goat" },
    ];

    return (
        <div className="relative flex items-center">
            <ul
                className="relative max-sm:w-full flex max-sm:flex-col flex-wrap items-center p-1 max-sm:py-3 list-none rounded bg-shark-200 dark:bg-0F0E0E"
                data-tabs="tabs"
                role="list"
            >
                {Items.map((item, i) => (
                    <li
                        key={i}
                        className="z-30 flex-auto text-center max-sm:w-full"
                    >
                        <Link
                            href={route(item.href)}
                            className={classNames(
                                "max-sm:w-full sm:w-min",
                                "z-30",
                                "flex items-center justify-center",
                                "px-2 py-1.5",
                                "transition-all ease-in-out",
                                "border-0 rounded-lg",
                                "cursor-pointer",
                                "whitespace-nowrap",
                                {
                                    "bg-royal-950 dark:bg-white text-white dark:text-black":
                                        route().current() == item.href,
                                    "text-gray-600 dark:text-white/80":
                                        route().current() != item.href,
                                }
                            )}
                            data-tab-target=""
                            role="tab"
                            aria-selected="true"
                        >
                            <span className="ml-1 font-medium text-sm">
                                {item.label}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
