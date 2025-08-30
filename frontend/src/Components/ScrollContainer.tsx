import React, { useRef, useState, useEffect } from "react";
import classNames from "classnames";

const ScrollContainer: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    const container = containerRef.current;
    if (container) {
      setIsDragging(true);
      setHasMoved(false);
      setStartX(e.pageX - container.offsetLeft);
      setScrollLeft(container.scrollLeft);
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const container = containerRef.current;
    if (container) {
      const x = e.pageX - container.offsetLeft;
      const walk = x - startX;

      // Eğer 5 pikselden fazla hareket ettiyse drag olarak kabul et
      if (Math.abs(walk) > 5) {
        setHasMoved(true);
        e.preventDefault();
      }

      container.scrollLeft = scrollLeft - walk;
    }
  };

  const stopDragging = () => {
    setIsDragging(false);
    setHasMoved(false);
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
        "scrollbar-hide",
        { "cursor-grabbing": isDragging },
        className
      )}
      onMouseDown={handleMouseDown}
    >
      {React.Children.map(children, (child) => (
        <div
          className="scroll-container-parent cursor-default flex"
          onClick={(e) => {
            // Eğer drag işlemi yapıldıysa click'i engelle
            if (hasMoved) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default ScrollContainer;
