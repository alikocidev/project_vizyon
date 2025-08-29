import React from "react";

interface CircularProgressBarProps {
    value?: number;
}

const getColor = (value: number): string => {
    if (value <= 25) {
        return "#ef4444";
    } else if (value < 70) {
        return "#eab308";
    } else {
        return "#22c55e";
    }
};

const getStrokeColor = (value: number): string => {
    if (value <= 25) {
        return "rgba(239, 68, 68, 0.25)";
    } else if (value < 70) {
        return "rgba(245, 158, 11, 0.25)";
    } else {
        return "rgba(22, 163, 74, 0.25)";
    }
};

const getBackgroundColor = (value: number): string => {
    if (value <= 25) {
        return "#450a0a";
    } else if (value < 70) {
        return "#422006";
    } else {
        return "#052e16";
    }
};

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({ value }) => {
    const percentage = value !== undefined && value !== null ? value * 10 : 0;

    const circleStyle = {
        strokeDasharray: "100 100",
        strokeDashoffset: 100 - percentage,
        strokeLinecap: "round" as const,
    };
    const pathColor = percentage > 0 ? getColor(percentage) : "#9ca3af";
    const strokeColor =
        percentage > 0 ? getStrokeColor(percentage) : "rgba(255,255,255,0.25)";

    const bgColor = percentage > 0 ? getBackgroundColor(percentage) : "#18181b";

    return (
        <div className="relative flex items-center justify-center w-10 h-10">
            <svg
                className="w-full h-full transform -rotate-90 rounded-full p-0.5"
                style={{ backgroundColor: bgColor }}
            >
                <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    stroke={strokeColor}
                    strokeWidth="4"
                    fill="transparent"
                />
                <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    stroke={pathColor}
                    strokeWidth="4"
                    fill="transparent"
                    style={circleStyle}
                />
            </svg>
            <div className="absolute text-white text-sm font-extrabold">
                {percentage > 0 ? percentage.toFixed() : "NA"}
            </div>
        </div>
    );
};

export default CircularProgressBar;
