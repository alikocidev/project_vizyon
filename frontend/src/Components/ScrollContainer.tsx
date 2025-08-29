import React, { useRef, useState, useEffect } from "react";
import classNames from "classnames";

const ScrollContainer: React.FC<{
    className?: string;
    children: React.ReactNode;
}> = ({ className, children }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [isOverItem, setIsOverItem] = useState(false);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (isOverItem) return;
        const container = containerRef.current;
        if (container) {
            setIsDragging(true);
            setStartX(e.pageX - container.offsetLeft);
            setScrollLeft(container.scrollLeft);
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const container = containerRef.current;
        if (container) {
            const x = e.pageX - container.offsetLeft;
            const walk = x - startX;
            container.scrollLeft = scrollLeft - walk;
        }
    };

    const stopDragging = () => {
        setIsDragging(false);
    };

    const handleMouseEnterItem = () => {
        setIsOverItem(true);
    };

    const handleMouseLeaveItem = () => {
        setIsOverItem(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", stopDragging);
            document.addEventListener("mouseleave", stopDragging);
        } else {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", stopDragging);
            document.removeEventListener("mouseleave", stopDragging);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", stopDragging);
            document.removeEventListener("mouseleave", stopDragging);
        };
    }, [isDragging]);

    return (
        <div
            ref={containerRef}
            className={classNames(
                "relative overflow-auto",
                "cursor-grab",
                "select-none pr-10",
                "max-sm:scrollbar-hide",
                className
            )}
            onMouseDown={handleMouseDown}
        >
            {React.Children.map(children, (child) => (
                <div
                    className="scroll-container-parent cursor-default flex"
                    onMouseEnter={handleMouseEnterItem}
                    onMouseLeave={handleMouseLeaveItem}
                >
                    {child}
                </div>
            ))}
        </div>
    );
};

export default ScrollContainer;
