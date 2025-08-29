import { Link, LinkProps } from "react-router-dom";
import classNames from "classnames";

interface NavLinkProps extends Omit<LinkProps, 'to'> {
    href: string;
    active?: boolean;
    className?: string;
    children: React.ReactNode;
}

export default function NavLink({
    active = false,
    className = "",
    children,
    href,
    ...props
}: NavLinkProps) {
    return (
        <Link
            {...props}
            to={href}
            className={classNames(
                "outline-none focus:ring-0 transition-[background-color,border-color] hover:bg-royal-950/10 dark:hover:bg-lotus-700/25 hover:border-royal-950",
                {
                    "!text-royal-950 dark:!text-FFF2D7 !border-royal-950 dark:!border-copper-rose-600 bg-royal-950/10 dark:bg-lotus-700/25":
                        active,
                },
                className
            )}
        >
            {children}
        </Link>
    );
}
