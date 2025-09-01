import { useAuth } from "@/hooks/useAuth";
import CoreLayout from "@/layouts/Core";
import { useState } from "react";

type TabListProps = "theaters" | "upcomings" | "popular" | "trending" | "goat";

const keyToName: Record<TabListProps, string> = {
  theaters: "Vizyondakiler",
  upcomings: "Çok Yakında",
  popular: "Popüler",
  trending: "Son Trendler",
  goat: "En İyiler",
};

const Movie = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<TabListProps>("theaters");

  return (
    <CoreLayout user={user} title="Movie">
      <div className="flex flex-col gap-4 xl:w-3/5 lg:w-3/4 sm:w-11/12 mx-auto">
        <div className="my-4 sm:my-10">
          <h1 className="text-5xl font-extrabold tracking-wide select-none text-light-text dark:text-dark-text">{keyToName[activeTab]}</h1>
        </div>
        <></>
      </div>
    </CoreLayout>
  );
};

export default Movie;
