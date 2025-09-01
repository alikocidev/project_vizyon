import classNames from "classnames";

interface Props {
  currentTab: string;
}

export default function Tabs({ currentTab }: Props) {
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
        className="relative max-sm:w-full flex max-sm:flex-col flex-wrap items-center p-1 max-sm:py-3 list-none rounded bg-shark-200 dark:bg-0F0E0E"
        data-tabs="tabs"
        role="list"
      >
        {Items.map((item, i) => (
          <li key={i} className="z-30 flex-auto text-center max-sm:w-full">
            <button
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
                  "bg-royal-950 dark:bg-white text-white dark:text-black": currentTab == item.key,
                  "text-gray-600 dark:text-white/80": currentTab != item.key,
                }
              )}
              data-tab-target=""
              role="tab"
              aria-selected="true"
            >
              <span className="ml-1 font-medium text-sm">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
