import classNames from "classnames";
import { motion } from "framer-motion";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Loading({
    className = "",
    w = 32,
    h = undefined,
}: {
    className?: string;
    w?: number;
    h?: number;
}) {
    return (
        <div role="status" className="flex items-center justify-center mx-auto">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className={classNames(
                    "text-light-text dark:text-dark-text",
                    className
                )}
                style={{ width: w, height: h || w }}
            >
                <AiOutlineLoading3Quarters 
                    size={w} 
                    className="w-full h-full"
                />
            </motion.div>
            <span className="sr-only">Loading...</span>
        </div>
    );
}
