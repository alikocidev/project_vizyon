import { TabListProps } from "@/types/movie.type";
import classNames from "classnames";
import { Dispatch } from "react";

interface Props {
  activeTab: TabListProps;
  setActiveTab: Dispatch<React.SetStateAction<TabListProps>>;
}

export default function Tabs({ activeTab, setActiveTab }: Props) {
  interface iItem {
    label: string;
    key: string;
  }

  const Items: iItem[] = [
    { label: "Vizyondakiler", key: "theaters" },
    { label: "Çok Yakında", key: "upcomings" },
    { label: "Popüler", key: "popular" },
    { label: "Son Trendler", key: "trending" },
    { label: "En İyiler", key: "goat" },
  ];

  return (
    <div className="relative flex items-center">
      <ul
        className="relative max-sm:w-full flex max-sm:flex-col flex-wrap items-center p-2 list-none sm:rounded-full bg-light-surface sm:bg-primary dark:bg-dark-primary dark:sm:bg-dark-surface shadow"
        data-tabs="tabs"
        role="list"
      >
        {Items.map((item, i) => (
          <li key={i} className="flex-auto text-center max-sm:w-full">
            <button
              onClick={() => setActiveTab(item.key as TabListProps)}
              className={classNames(
                "max-sm:w-full sm:w-min",
                "z-30",
                "flex items-center sm:justify-center",
                "px-2 py-1",
                "transition-all ease-in-out",
                "border-0 rounded-full",
                "cursor-pointer",
                "whitespace-nowrap",
                {
                  "bg-light-primary sm:bg-light-primary dark:bg-dark-surface dark:sm:bg-dark-secondary text-light-text dark:text-dark-text": activeTab == item.key,
                  "text-light-text sm:text-white dark:text-dark-text dark:sm:text-white/80": activeTab != item.key,
                }
              )}
              data-tab-target=""
              role="tab"
              aria-selected="true"
            >
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
