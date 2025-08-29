import classNames from "classnames";
import { Link } from "react-router-dom";
import ApplicationLogo from "@/Components/ApplicationLogo";

export default function Footer() {
    return (
        <footer
            className={classNames(
                "w-full mt-auto p-6 md:p-10",
                "text-sm text-white",
                "bg-royal-950 dark:bg-0F0E0E",
                "h-40"
            )}
        >
            <div className="w-full flex items-center">
                <Link
                    to="/"
                    className="flex items-center gap-2 pr-1 focus:ring-0 focus:outline-royal-600 dark:focus:outline-lotus-600 focus:rounded-sm"
                >
                    <ApplicationLogo className="block h-10 w-auto fill-white" />
                    <h1 className="font-bold text-xl">
                        {import.meta.env.VITE_APP_NAME}
                    </h1>
                </Link>
                <div className="ml-auto">
                    <a href="https://www.themoviedb.org/" target="_blank">
                        <img
                            className="w-32 sm:w-40"
                            src="/assets/images/tmdb/alt-long.svg"
                            alt="themoviedatabase"
                        />
                    </a>
                </div>
            </div>
        </footer>
    );
}
