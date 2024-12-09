import { ColorPicker } from '@lidojs/color-picker';
import { Color } from '@lidojs/design-utils';
import { FC, Fragment, PropsWithChildren, useRef, useState } from 'react';
import Popover from '../../common/popover/Popover';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  event: 'click' | 'doubleClick';
}

const ColorPickerPopover: FC<PropsWithChildren<ColorPickerProps>> = ({
  color,
  event,
  onChange,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openColorPicker, setOpenColorPicker] = useState(false);

  return (
    <Fragment>
      <div
        ref={containerRef}
        style={{ cursor: 'pointer' }}
        onClick={() => event === 'click' && setOpenColorPicker(true)}
        onDoubleClick={() =>
          event === 'doubleClick' && setOpenColorPicker(true)
        }
      >
        {children}
      </div>
      <Popover
        anchorEl={containerRef.current}
        offsets={{ bottom: { y: 8, x: 0 } }}
        open={openColorPicker}
        placement={'bottom'}
        onClose={() => setOpenColorPicker(false)}
      >
        <div style={{ padding: 16, width: 280 }}>
          <ColorPicker color={new Color(color).toHex()} onChange={onChange} />
        </div>
      </Popover>
    </Fragment>
  );
};

export default ColorPickerPopover;
