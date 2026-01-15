import "@/styles/multiRangeSlider.css";
import classNames from "classnames";
import { useState, useRef, useEffect, useCallback } from "react";

interface MultiRangeSliderProps {
  min: number;
  max: number;
  onChange: ({ min, max }: { min: number; max: number }) => void;
  step?: number;
  defaultMinValue?: number;
  defaultMaxValue?: number;
}

const MultiRangeSlider: React.FC<MultiRangeSliderProps> = ({
  min,
  max,
  onChange,
  step = 1.0,
  defaultMinValue,
  defaultMaxValue,
}) => {
  const [minVal, setMinVal] = useState(defaultMinValue ?? min);
  const [maxVal, setMaxVal] = useState(defaultMaxValue ?? max);
  const minValRef = useRef<HTMLInputElement>(null);
  const maxValRef = useRef<HTMLInputElement>(null);
  const range = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(+maxValRef.current.value);

      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(maxVal);

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [maxVal, getPercent]);

  // Get min and max values when their state changes
  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal]);

  return (
    <div className="relative w-full" id="multi-range-slider">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        ref={minValRef}
        step={step}
        onChange={(event) => {
          const value = Math.min(+event.target.value, maxVal - 1);
          setMinVal(value);
          event.target.value = value.toString();
        }}
        className={classNames("thumb thumb--zindex-3", {
          "thumb--zindex-5": minVal > max - 100,
        })}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        ref={maxValRef}
        step={step}
        onChange={(event) => {
          const value = Math.max(+event.target.value, minVal + 1);
          setMaxVal(value);
          event.target.value = value.toString();
        }}
        className="thumb thumb--zindex-4"
      />
      <div className="slider">
        <div className="slider__track bg-light-surface dark:bg-dark-surface" />
        <div
          ref={range}
          className="slider__range bg-indigo-500 dark:bg-secondary"
        />
      </div>
    </div>
  );
};

export default MultiRangeSlider;
