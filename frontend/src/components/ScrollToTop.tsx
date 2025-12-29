import { motion } from "framer-motion";
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
    <div className="fixed bottom-10 right-4 z-[999]">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0 }}
        >
          <button
            onClick={scrollToTop}
            className="bg-primary dark:bg-dark-surface text-white p-2 rounded-full shadow-lg hover:bg-royal-800 transition duration-300 hover:scale-110 focus:outline-none"
          >
            <FaArrowUp size={20} />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ScrollToTopButton;
