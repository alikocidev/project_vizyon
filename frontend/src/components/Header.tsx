import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames";
import { motion, AnimatePresence } from "framer-motion";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { HiMiniBars3BottomRight } from "react-icons/hi2";
import { IoCloseOutline, IoSearchSharp } from "react-icons/io5";
import { FaUserGear } from "react-icons/fa6";
import { IoMdHome, IoIosLogOut } from "react-icons/io";
import { MdMessage } from "react-icons/md";
import { RiCompassDiscoverLine, RiHeartsFill } from "react-icons/ri";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { User } from "@/types";
import useTheme from "@/hooks/useTheme";
import { ApplicationLogo } from "@/components/ApplicationLogo";
import { useAuth } from "@/hooks/useAuth";

type ItemType = {
  href: string;
  icon: React.ElementType;
  label: string;
  isMobile?: boolean;
  requireAuth?: boolean;
};

const HeaderItems: ItemType[] = [
  {
    href: "/",
    label: "Ana Sayfa",
    icon: IoMdHome,
    isMobile: true,
  },
  {
    href: "/movie",
    icon: RiCompassDiscoverLine,
    label: "Filmler",
  },
  {
    href: "/discover",
    icon: RiCompassDiscoverLine,
    label: "Keşfet",
  },
  {
    href: "/discussions",
    icon: MdMessage,
    label: "Tartışma",
  },
  {
    href: "/favorites",
    icon: RiHeartsFill,
    label: "Favoriler",
    requireAuth: true,
  },
];

export default function Header({
  user,
  title,
  loading,
}: {
  user: User | null;
  title: string;
  loading?: boolean;
}) {
  const { theme, toggleTheme } = useTheme();
  const [showingNavigationDropdown, setShowingNavigationDropdown] =
    useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/discover?s=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const MobileMenuButton = () => (
    <button
      onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
      className="inline-flex items-center justify-center rounded text-light-text dark:text-dark-text focus:outline-none hover:bg-neutral-200 dark:hover:bg-neutral-800 focus:text-light-text dark:focus:text-dark-text md:transition"
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

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logout();
  };

  return (
    <header className="fixed top-0 w-full z-[999]">
      <title>{title}</title>
      <nav
        className={classNames(
          "bg-light-primary dark:bg-dark-primary shadow-2xl"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="shrink-0 flex items-center">
                <Link to="/" className="flex items-center gap-2">
                  <ApplicationLogo className="block h-9 w-auto fill-current text-primary dark:text-secondary" />
                  <span className="font-bold text-xl text-primary dark:text-dark-text">
                    {import.meta.env.VITE_APP_NAME}
                  </span>
                </Link>
              </div>

              <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                {HeaderItems.filter(
                  (item) => !item.isMobile && (!item.requireAuth || user)
                ).map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="inline-flex items-center gap-2 px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-neutral-600 dark:text-neutral-400 hover:text-light-text dark:hover:text-dark-text hover:border-primary dark:hover:border-secondary focus:outline-none focus:text-light-text dark:focus:text-dark-text focus:border-primary dark:focus:border-secondary transition duration-150 ease-in-out"
                    >
                      <IconComponent className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="hidden md:flex md:items-center md:ml-6 md:space-x-4">
              {/* Search Input */}
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Film ara..."
                    className="w-64 pl-10 pr-4 py-2 text-sm bg-light-surface dark:bg-dark-surface border border-light-text/20 dark:border-dark-text/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent text-light-text dark:text-dark-text placeholder-light-text/50 dark:placeholder-dark-text/50"
                  />
                  <IoSearchSharp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-light-text/50 dark:text-dark-text/50" />
                </div>
              </form>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-neutral-500 hover:text-primary dark:hover:text-secondary hover:bg-primary/10 dark:hover:bg-secondary/10 focus:outline-none transition duration-150 ease-in-out"
              >
                {theme === "dark" ? (
                  <MdLightMode className="h-5 w-5" />
                ) : (
                  <MdDarkMode className="h-5 w-5" />
                )}
              </button>

              {loading ? (
                <div className="ml-3 flex items-center">
                  <AiOutlineLoading3Quarters className="h-4 w-4 animate-spin text-primary dark:text-secondary" />
                </div>
              ) : user ? (
                <div className="ml-3 relative flex items-center gap-2">
                  <Link
                    to="/profile"
                    className="text-light-text dark:text-dark-text hover:text-primary dark:hover:text-secondary"
                  >
                    <span className="text-sm underline">
                      Hoş geldin' {user.name}!
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center text-sm text-light-text dark:text-dark-text group border rounded border-primary/50 dark:border-secondary/50 p-1 hover:border-primary dark:hover:border-secondary hover:bg-primary/10 dark:hover:bg-secondary/10 focus:outline-none transition"
                  >
                    <IoIosLogOut className="h-4 w-4 text-primary dark:text-secondary" />
                  </button>
                </div>
              ) : (
                <div className="ml-3 flex items-center justify-center gap-4">
                  <Link
                    to="/login"
                    className="text-neutral-500 dark:text-neutral-400 hover:text-primary dark:hover:text-dark-text font-medium"
                  >
                    Giriş
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-4 py-2 bg-primary dark:bg-dark-surface border border-transparent rounded-md font-medium text-xs text-white dark:text-white uppercase tracking-widest hover:bg-primary/90 dark:hover:bg-secondary/90 focus:bg-primary/90 dark:focus:bg-secondary/90 active:bg-primary/80 dark:active:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:ring-offset-2 dark:focus:ring-offset-dark-primary transition ease-in-out duration-150"
                  >
                    Kayıt
                  </Link>
                </div>
              )}
            </div>

            <div className="-mr-2 flex items-center md:hidden">
              <MobileMenuButton />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showingNavigationDropdown && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden"
            >
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="pt-2 pb-3 space-y-1"
              >
                {/* Mobile Search */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{
                    duration: 0.3,
                    delay: 0,
                    ease: "easeInOut",
                  }}
                  className="px-3 pb-3"
                >
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Film ara..."
                        className="w-full pl-10 pr-4 py-2 text-sm bg-light-surface dark:bg-dark-surface border border-light-text/20 dark:border-dark-text/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-secondary focus:border-transparent text-light-text dark:text-dark-text placeholder-light-text/50 dark:placeholder-dark-text/50"
                      />
                      <IoSearchSharp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-light-text/50 dark:text-dark-text/50" />
                    </div>
                  </form>
                </motion.div>

                {HeaderItems.filter((item) => !item.requireAuth || user).map(
                  (item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{
                          duration: 0.3,
                          delay: (index + 1) * 0.1,
                          ease: "easeInOut",
                        }}
                      >
                        <Link
                          to={item.href}
                          className="flex items-center gap-3 pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-neutral-600 dark:text-neutral-400 hover:text-light-text dark:hover:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface hover:border-primary dark:hover:border-secondary focus:outline-none focus:text-light-text dark:focus:text-dark-text focus:bg-light-surface dark:focus:bg-dark-surface focus:border-primary dark:focus:border-secondary transition duration-150 ease-in-out"
                          onClick={() => setShowingNavigationDropdown(false)}
                        >
                          <IconComponent className="h-5 w-5" />
                          {item.label}
                        </Link>
                      </motion.div>
                    );
                  }
                )}

                {/* Mobil için tema toggle butonu */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{
                    duration: 0.3,
                    delay: HeaderItems.length * 0.1,
                    ease: "easeInOut",
                  }}
                  className="border-t border-light-surface dark:border-dark-surface pt-2 mt-2"
                >
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-3 pl-3 pr-4 py-2 w-full text-base font-medium text-neutral-600 dark:text-neutral-400 hover:text-light-text dark:hover:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface transition duration-150 ease-in-out"
                  >
                    {theme === "dark" ? (
                      <MdLightMode className="h-5 w-5" />
                    ) : (
                      <MdDarkMode className="h-5 w-5" />
                    )}
                    {theme === "dark" ? "Açık Tema" : "Koyu Tema"}
                  </button>
                </motion.div>

                {/* Mobil için kullanıcı kısmı */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{
                    duration: 0.3,
                    delay: (HeaderItems.length + 1) * 0.1,
                    ease: "easeInOut",
                  }}
                  className="border-t border-light-surface dark:border-dark-surface pt-2 mt-2"
                >
                  {loading ? (
                    <div className="pl-3 pr-4 py-2 flex items-center justify-center">
                      <AiOutlineLoading3Quarters className="h-5 w-5 animate-spin text-primary dark:text-secondary" />
                    </div>
                  ) : user ? (
                    <div className="pl-3 pr-2 flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-light-text dark:text-dark-text">
                        Hoş geldin, {user.name}!
                      </span>
                      <div className="flex items-center gap-2">
                        <Link
                          to="/profile"
                          className="flex items-center justify-center text-sm text-light-text dark:text-dark-text group border rounded border-primary/50 dark:border-secondary/50 p-1 hover:border-primary dark:hover:border-secondary hover:bg-primary/10 dark:hover:bg-secondary/10 focus:outline-none transition"
                        >
                          <FaUserGear className="h-4 w-4 text-primary dark:text-secondary" />
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center justify-center text-sm text-light-text dark:text-dark-text group border rounded border-primary/50 dark:border-secondary/50 p-1 hover:border-primary dark:hover:border-secondary hover:bg-primary/10 dark:hover:bg-secondary/10 focus:outline-none transition"
                        >
                          <IoIosLogOut className="h-4 w-4 text-primary dark:text-secondary" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 justify-center">
                      <Link
                        to="/login"
                        className="flex items-center w-full justify-center gap-3 pl-3 pr-4 py-2 text-base font-medium text-neutral-600 dark:text-neutral-400 hover:text-light-text dark:hover:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface transition duration-150 ease-in-out"
                        onClick={() => setShowingNavigationDropdown(false)}
                      >
                        Giriş
                      </Link>
                      <Link
                        to="/register"
                        className="flex items-center w-full justify-center gap-3 pl-3 pr-4 py-2 text-base font-medium bg-primary dark:bg-secondary text-white hover:bg-primary/90 dark:hover:bg-secondary/90 transition duration-150 ease-in-out mx-3 rounded-md"
                        onClick={() => setShowingNavigationDropdown(false)}
                      >
                        Kayıt
                      </Link>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
