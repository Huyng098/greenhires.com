import React, { CSSProperties, FC, useCallback, useMemo } from 'react';
import { CornerDirection } from '../../types';
import ResizeIcon from './ResizeIcon';

interface ResizeIconProps {
  direction: CornerDirection;
  onResizeStart: (
    e: TouchEvent | MouseEvent,
    direction: CornerDirection
  ) => void;
}

const ResizeHandler: FC<ResizeIconProps> = ({ direction, onResizeStart }) => {
  const css = useMemo(() => {
    const res: CSSProperties = {};
    if (direction === 'topLeft') {
      res.top = -12;
      res.left = -12;
      res.transform = 'translate(2px,2px)';
    }
    if (direction === 'topRight') {
      res.top = -12;
      res.right = -12;
      res.transform = 'rotate(90deg) translate(2px,2px)';
    }
    if (direction === 'bottomRight') {
      res.bottom = -12;
      res.right = -12;
      res.transform = 'rotate(180deg) translate(2px,2px)';
    }
    if (direction === 'bottomLeft') {
      res.bottom = -12;
      res.left = -12;
      res.transform = 'rotate(270deg) translate(2px,2px)';
    }
    return res;
  }, [direction]);
  const handleResizeStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      onResizeStart(e.nativeEvent, direction);
    },
    [onResizeStart, direction]
  );
  return (
    <div
      style={{
        position: 'absolute',
        width: 24,
        height: 24,
        ...css,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
        color: 'white',
      }}
      onMouseDown={handleResizeStart}
      onTouchStart={handleResizeStart}
    >
      <ResizeIcon />
    </div>
  );
};

export default ResizeHandler;
