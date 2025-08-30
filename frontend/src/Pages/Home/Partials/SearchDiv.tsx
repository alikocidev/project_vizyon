import Loading from "@/components/Loading";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import classNames from "classnames";

const SearchDiv = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = () => {
    const query = searchQuery.trim().toLowerCase();
    if (isLoading || query.length < 3) return;
    setIsLoading(true);

    // Navigate to discover page with search query
    navigate(`/discover?s=${encodeURIComponent(query)}`);
    setIsLoading(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full flex gap-4 relative overflow-hidden px-4 sm:px-10 pt-20 pb-20 sm:pb-40">
      <>
        <div id="bg-slide-pic" className="absolute w-full h-full top-0 left-0 bg-contain overflow-hidden"></div>
        <div className="absolute w-full h-full top-0 left-0 bg-light-text/80 dark:bg-dark-primary/75"></div>
      </>
      <div className="space-y-2 z-10 flex flex-col w-full gap-32">
        <div className="max-sm:text-center w-full space-y-3">
          <h1 className="font-extrabold text-5xl text-light-primary dark:text-dark-text drop-shadow-lg">Hoş geldiniz !</h1>
          <h1 className="font-extrabold text-xl text-light-primary dark:text-dark-text drop-shadow-lg">İzlenilecek bir şeyler keşfet</h1>
        </div>
        <div className="flex items-center">
          <input
            id="search"
            type="text"
            name="search"
            className={classNames("w-full sm:w-2/3 border rounded py-2.5 px-4 mr-2 transition")}
            placeholder="Aklından neler geçiyor ?"
            autoComplete="off"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSearch}
            className={classNames(
              "p-2.5 transition-colors border rounded",
              "bg-light-primary dark:bg-dark-primary",
              "text-light-text dark:text-dark-text",
              "border-light-surface dark:border-dark-surface",
              "hover:text-primary dark:hover:text-secondary",
              "hover:border-primary dark:hover:border-secondary"
            )}
          >
            {!isLoading ? <IoSearchSharp className="w-6 h-6" /> : <Loading w={24} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchDiv;
