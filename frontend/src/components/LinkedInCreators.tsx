import { FC, useEffect, useState } from "react";
import { FaLinkedinIn } from "react-icons/fa";
import { motion } from "framer-motion";

interface Creator {
  name: string;
  linkedInUrl: string;
  imageUrl: string;
}

const creators: Creator[] = [
  {
    name: "-a",
    linkedInUrl: "https://www.linkedin.com/in/aliko/",
    imageUrl: "images/alikoc.jpg",
  },
  {
    name: "Cio",
    linkedInUrl: "https://www.linkedin.com/in/bugra-cihan-gunduz/",
    imageUrl: "images/bugracihangunduz.jpg",
  },
];

const LinkedInCreators: FC = () => {
  const [goLeft, setGoLeft] = useState<boolean>(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY < 300) {
        setGoLeft(true);
      } else {
        setGoLeft(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-8 right-6 flex gap-3 z-50 ">
      {creators.map((creator, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: goLeft ? 0 : -40 }}
          transition={{ duration: 0.4, delay: index * 0.2 }}
        >
          <a
            key={index}
            href={creator.linkedInUrl}
            target="_blank"
            className="group relative"
            aria-label={`${creator.name} LinkedIn Profile`}
          >
            <div className="relative w-14 h-14">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-lg hover:scale-110 transition-transform duration-200">
                <img
                  src={creator.imageUrl}
                  alt={creator.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* LinkedIn badge sağ alt köşede */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#0077B5] rounded-full flex items-center justify-center border border-white dark:border-gray-800 shadow-md">
                <FaLinkedinIn className="text-white w-3 h-3" />
              </div>
            </div>

            {/* Tooltip */}
            <div className="absolute left-1/2 -top-1/2 translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-gray-800 text-white text-sm py-1 px-3 rounded whitespace-nowrap">
                {creator.name}
              </div>
            </div>
          </a>
        </motion.div>
      ))}
    </div>
  );
};

export default LinkedInCreators;
