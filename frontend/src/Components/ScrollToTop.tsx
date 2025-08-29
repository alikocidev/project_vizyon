import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

const ScrollToTopButton: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);

        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div className="fixed bottom-2 right-4 max-sm:hidden z-[100]">
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="bg-royal-950 text-white p-2 rounded-full shadow-lg hover:bg-royal-800 transition duration-300 hover:-translate-y-1/3"
                >
                    <FaArrowUp size={20} />
                </button>
            )}
        </div>
    );
};

export default ScrollToTopButton;
