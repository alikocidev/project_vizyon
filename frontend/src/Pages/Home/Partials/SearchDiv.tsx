import Loading from "@/Components/Loading";
import TextInput from "@/Components/TextInput";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";

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
                <div
                    id="bg-slide-pic"
                    className="absolute w-full h-full top-0 left-0 bg-contain overflow-hidden"
                ></div>
                <div className="absolute w-full h-full top-0 left-0 bg-royal-950/80 dark:bg-black/80"></div>
            </>
            <div className="space-y-2 z-50 flex flex-col w-full gap-32">
                <div className="max-sm:text-center w-full space-y-3">
                    <h1 className="font-extrabold text-5xl text-white drop-shadow-lg">
                        Hoş geldiniz !
                    </h1>
                    <h1 className="font-extrabold text-3xl text-white drop-shadow-lg">
                        İzlenilecek Bir şeyler keşfet
                    </h1>
                </div>
                <div className="flex items-center">
                    <TextInput
                        id="search"
                        type="text"
                        name="search"
                        className="w-full sm:w-2/3 border-2 rounded-lg border-gray-200 focus:!border-royal-700 py-2.5 px-4 mr-2 dark:bg-shark-950 dark:placeholder:text-white focus:placeholder:text-transparent dark:focus:placeholder:text-transparent dark:focus:!border-lotus-500"
                        placeholder="Aklından neler geçiyor ?"
                        autoComplete="off"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        onClick={handleSearch}
                        className="p-2.5 bg-white dark:text-white dark:bg-shark-950 border-2 rounded-lg border-gray-200 dark:border-gray-700 text-royal-950 hover:border-royal-700 dark:hover:border-lotus-500"
                    >
                        {!isLoading ? (
                            <IoSearchSharp className="w-6 h-6" />
                        ) : (
                            <Loading w={24} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchDiv;
