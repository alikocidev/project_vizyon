import { FaArrowTrendUp } from "react-icons/fa6";
import { IoMdHome } from "react-icons/io";
import { MdMessage } from "react-icons/md";
import { RiCompassDiscoverLine } from "react-icons/ri";

type ItemType = {
    href: string;
    icon: React.ElementType;
    label: string;
    isMobile?: boolean;
};

export const HeaderItems: ItemType[] = [
    {
        href: "home",
        label: "Anasayfa",
        icon: IoMdHome,
        isMobile: true,
    },
    {
        href: "movie.theaters",
        icon: RiCompassDiscoverLine,
        label: "Filmler",
    },
    {
        href: "home",
        icon: RiCompassDiscoverLine,
        label: "Diziler",
    },
    {
        href: "discover",
        icon: RiCompassDiscoverLine,
        label: "Keşfet",
    },
    {
        href: "home",
        icon: FaArrowTrendUp,
        label: "Trendler",
        isMobile: true,
    },
    {
        href: "home",
        icon: MdMessage,
        label: "Tartışma",
    },
];
