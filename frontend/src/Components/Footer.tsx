import classNames from "classnames";
import { Link } from "react-router-dom";
import ApplicationLogo from "@/Components/ApplicationLogo";

export default function Footer() {
  return (
    <footer
      className={classNames("w-full mt-auto p-6 md:p-10", "bg-primary dark:bg-dark-primary border-t border-light-surface dark:border-dark-surface")}
    >
      <div className="w-full flex items-center">
        <Link
          to="/"
          className="flex items-center gap-2 pr-1 focus:ring-0 focus:outline-primary dark:focus:outline-secondary focus:rounded-sm hover:opacity-80 transition duration-150 ease-in-out"
        >
          <ApplicationLogo className="block h-10 w-auto fill-current text-light-primary dark:text-secondary" />
          <h1 className="font-bold text-xl text-light-primary dark:text-dark-text">{import.meta.env.VITE_APP_NAME}</h1>
        </Link>
        <div className="ml-auto opacity-70 hover:opacity-100 transition duration-150 ease-in-out">
          <a href="https://www.themoviedb.org/" target="_blank">
            <img className="w-32 sm:w-40" src="/assets/images/tmdb/alt-long.svg" alt="themoviedatabase" />
          </a>
        </div>
      </div>
    </footer>
  );
}
