import { getPosition } from "@lidojs/design-utils";
import { Typography } from "@mui/material";
import { throttle } from "lodash";
import React, { FC, useEffect, useRef, useState } from "react";

interface SliderProps {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  hideLabel?: boolean;
  hideInput?: boolean;
  defaultValue?: number;
  value?: number;
  onChange?: (value: number) => void;
}

const Slider: FC<SliderProps> = ({
  label,
  min = 0,
  max = 100,
  step = 1,
  defaultValue,
  value,
  hideLabel,
  hideInput,
  onChange,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const dragDataRef = useRef<{ startPoint: number; startValue: number }>({
    startPoint: 0,
    startValue: 0,
  });
  const [zeroPoint, setZeroPoint] = useState<number>(0);
  const [v, setV] = useState<number>(defaultValue || value || 0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (value !== undefined) {
      setV(value);
      if (inputRef.current) {
        inputRef.current.value = `${value}`;
      }
    }
  }, [value]);
  useEffect(() => {
    if (min < 0) {
      const totalPoints = max - min;
      const zeroPoint = -min;
      const zeroPercent = (zeroPoint / totalPoints) * 100;
      setZeroPoint(zeroPercent);
    }
  }, [min, max]);

  const getDiffPosition = (clientX: number) => {
    const trackRect = trackRef.current?.getBoundingClientRect() as DOMRect;
    return clientX - trackRect.x;
  };

  const changeValue = (value: number) => {
    setV(value);
    const vArr = (step + "").split(".");
    const rValue = parseFloat(
      (Math.round(value / step) * step).toFixed(vArr[1]?.length || 0)
    );
    if (inputRef.current) {
      inputRef.current.value = rValue + "";
    }
    onChange && onChange(rValue);
  };

  const getChange = (diff: number) => {
    const trackRect = trackRef.current?.getBoundingClientRect() as DOMRect;
    const ratio = trackRect.width / (max - min);
    return diff / ratio;
  };
  const handleMouseMove = throttle((e: MouseEvent | TouchEvent) => {
    const { clientX } = getPosition(e);
    const mouseDiff = clientX - dragDataRef.current.startPoint;
    const diff = Math.max(
      min,
      Math.min(max, dragDataRef.current.startValue + getChange(mouseDiff))
    );
    changeValue(diff);
  }, 16);
  const handleMouseUp = (e: MouseEvent | TouchEvent) => {
    const { clientX } = getPosition(e);
    const mouseDiff = clientX - dragDataRef.current.startPoint;
    if (mouseDiff) {
      const diff = Math.max(
        min,
        Math.min(max, dragDataRef.current.startValue + getChange(mouseDiff))
      );
      changeValue(diff);
    }
    unbindEvents();
  };
  const bindEvents = () => {
    setIsDragging(true);
    window.addEventListener("touchmove", handleMouseMove);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp, { once: true });
    window.addEventListener("mouseleave", handleMouseUp, { once: true });
    window.addEventListener("touchend", handleMouseUp, { once: true });
  };
  const unbindEvents = () => {
    setIsDragging(false);
    window.removeEventListener("touchmove", handleMouseMove);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
    window.removeEventListener("mouseleave", handleMouseUp);
    window.removeEventListener("touchend", handleMouseUp);
  };

  const handleStartDrag = (e: React.MouseEvent | React.TouchEvent) => {
    const { clientX } = getPosition(e.nativeEvent);
    const diff = getDiffPosition(clientX);
    const newVal = getChange(diff);

    dragDataRef.current.startPoint = clientX;
    dragDataRef.current.startValue = min + newVal;
    changeValue(min + newVal);
    bindEvents();
  };

  const handleUpdateValue = () => {
    if (inputRef.current) {
      const v = Math.max(
        min,
        Math.min(max, parseInt(inputRef.current.value, 10))
      );
      inputRef.current.blur();
      changeValue(v);
    }
  };
  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key.toLowerCase() === "enter") {
      handleUpdateValue();
    }
  };
  return (
    <div
      style={{
        display: "grid",
        gridColumnGap: 16,
        gridRowGap: 8,
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
      }}
    >
      {!hideLabel && (
        <div
          style={{
            fontSize: 14,
            textTransform: "capitalize",
            whiteSpace: "nowrap",
          }}
        >
          <Typography fontSize={14}>{label}</Typography>
        </div>
      )}
      {!hideInput && (
        <div
          style={{
            background: "#fff",
            border: "1px solid rgba(43,59,74,.3)",
            width: 40,
            height: 24,
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <input
            ref={inputRef}
            style={{
              width: "100%",
              height: "100%",
              padding: 2,
              textAlign: "center",
            }}
            defaultValue={v}
            onBlur={handleUpdateValue}
            onKeyDown={handleKeyUp}
          />
        </div>
      )}
      <div
        style={{
          height: 16,
          position: "relative",
          width: "100%",
          gridRow: hideInput && hideLabel ? 1 : "2/auto",
          gridColumn: "1/-1",
        }}
        onMouseDown={handleStartDrag}
        onTouchStart={handleStartDrag}
      >
        <div
          ref={trackRef}
          style={{
            width: "100%",
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            height: 2,
            borderRadius: 2,
            cursor: "pointer",
            backgroundColor: "#bbbbbb",
          }}
        />
        {zeroPoint > 0 && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              width: "100%",
              transform: "translateY(-50%)",
              display: "inline-flex",
            }}
          >
            <div
              style={{
                width: `calc(${zeroPoint}% - 2px)`,
                maxWidth: "calc(100% - 4px)",
              }}
            />
            <div
              style={{
                width: 4,
                height: 4,
                transform: "translateY(-6px)",
                borderRadius: "50%",
                background: "#bbbbbb",
              }}
            />
          </div>
        )}
        <div
          ref={markRef}
          style={{
            position: "absolute",
            top: "50%",
            width: `${
              ((Math.abs(v) - (min > 0 ? min : 0)) / (max - min)) * 100
            }%`,
            marginLeft: `${Math.min(
              zeroPoint,
              zeroPoint + (v / (max - min)) * 100
            )}%`,
            transform: `scaleX(${v >= 0 ? 1 : -1})`,
          }}
        >
          <div
            style={{
              backgroundColor: "#3d8eff",
              width: "100%",
              height: 2,
              transform: "translateY(-50%)",
              position: "absolute",
              borderRadius: 2,
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                transform: `translate(-50%, -50%)`,
                background: "#fff",
                left: "100%",
                position: "absolute",
              }}
              onMouseDown={handleStartDrag}
              onTouchStart={handleStartDrag}
            >
              <div
                style={{
                  position: "absolute",
                  borderRadius: "50%",
                  width: 16,
                  height: 16,
                  transform: isDragging ? " scale(1.125)" : undefined,
                  border: isDragging
                    ? "1px solid #3d8eff"
                    : "1px solid #5E6278",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  borderRadius: "50%",
                  width: 16,
                  height: 16,
                  boxShadow: isDragging
                    ? "0 0 0 8px #3d8eff"
                    : "0 0 4px 1px #bbbbbb",
                  opacity: isDragging ? 0.5 : 1,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slider;
