import Loading from "@/components/Loading";
import { TabListProps } from "@/types/movie.type";
import classNames from "classnames";
import { Dispatch } from "react";

interface Props {
  activeTab: TabListProps;
  setActiveTab: Dispatch<React.SetStateAction<TabListProps>>;
  isLoading: boolean;
  tabs: Record<TabListProps, string>;
}

export default function Tabs({ activeTab, setActiveTab, isLoading, tabs }: Props) {
  return (
    <div className="relative flex items-center overflow-auto w-full scrollbar-hide">
      <ul
        className="relative flex items-center p-2 list-none bg-light-surface sm:bg-primary dark:bg-dark-primary dark:sm:bg-dark-surface shadow sm:rounded-full"
        data-tabs="tabs"
        role="list"
      >
        {Object.entries(tabs).map(([key, label], i) => (
          <li key={i} className="flex-auto text-center max-sm:w-full">
            <button
              onClick={() => setActiveTab(key as TabListProps)}
              className={classNames(
                "relative",
                "max-sm:w-full sm:w-min",
                "z-30",
                "flex items-center sm:justify-center",
                "px-2 py-1",
                "transition-all ease-in-out",
                "border-0 rounded-full",
                "cursor-pointer",
                "whitespace-nowrap",
                {
                  "bg-light-primary sm:bg-light-primary dark:bg-dark-surface dark:sm:bg-dark-secondary text-light-text dark:text-dark-text":
                    activeTab == key,
                  "text-light-text sm:text-white dark:text-dark-text dark:sm:text-white/80": activeTab != key,
                }
              )}
              data-tab-target=""
              role="tab"
              aria-selected="true"
            >
              <span className="font-medium text-sm">{label}</span>
              {isLoading && activeTab == key && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loading w={20} />
                </div>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
