import React, { FC, Fragment, useMemo, useState } from 'react';
import { useEditor } from '../hooks';
import { SvgLayerProps } from '../layers/SvgLayer';
import { Layer } from '../types';
import SettingButton from './SettingButton';
import ColorSidebar from './sidebar/ColorSidebar';

interface SvgSettingsProps {
  layer: Layer<SvgLayerProps>;
}

const SvgSettings: FC<SvgSettingsProps> = ({ layer }) => {
  const { actions, activePage, sidebar } = useEditor((state) => ({
    activePage: state.activePage,
    sidebar: state.sidebar,
  }));
  const [activeColor, setActiveColor] = useState<number | null>(null);

  const colors = useMemo(() => {
    return layer.data.props.colors;
  }, [layer]);
  const updateColor = (color: string) => {
    if (activeColor !== null) {
      actions.history
        .throttle(2000)
        .setProp<SvgLayerProps>(activePage, layer.id, {
          colors: [
            ...colors.slice(0, activeColor),
            color,
            ...colors.slice(activeColor + 1, colors.length),
          ],
        });
    }
  };
  return (
    <div
      style={{
        display: 'grid',
        alignItems: 'center',
        gridAutoFlow: 'column',
        gridGap: 8,
      }}
    >
      <div
        style={{
          display: 'grid',
          alignItems: 'center',
          gridAutoFlow: 'column',
        }}
      >
        {colors.map((color, idx) => {
          return (
            <Fragment key={idx}>
              <SettingButton
                isActive={idx === activeColor}
                onClick={() => {
                  setActiveColor(idx);
                  actions.setSidebar('CHOOSING_COLOR');
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    background:
                      color ??
                      'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
                    boxShadow: 'inset 0 0 0 1px rgba(57,76,96,.15)',
                    borderRadius: 2,
                  }}
                />
              </SettingButton>
              {sidebar === 'CHOOSING_COLOR' && (
                <ColorSidebar
                  open={true}
                  selected={color}
                  onSelect={updateColor}
                />
              )}
            </Fragment>
          );
        })}
      </div>
      <div
        style={{ height: 24, width: `1px`, background: 'rgba(57,76,96,.15)' }}
      />
    </div>
  );
};

export default SvgSettings;
