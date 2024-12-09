import { EffectSettings } from '@lidojs/design-core';
import { Color } from '@lidojs/design-utils';
import { CSSProperties } from 'react';

export const getTextEffectStyle = (
  effect: string,
  settings: EffectSettings,
  textColor: string,
  fontSize: number
) => {
  const res: CSSProperties = {};
  if (effect === 'shadow') {
    const color = new Color(settings.color as string);
    const radians = ((settings.direction || 0) * Math.PI) / 180;

    const x =
      (settings.offset || 0) * 0.00183334 * fontSize * Math.sin(radians);
    const y =
      (settings.offset || 0) * 0.00183334 * fontSize * Math.cos(radians);
    res.textShadow = `${color
      .alpha((settings.transparency || 0) / 100)
      .toRgbString()} ${x}px ${y}px ${settings.blur}px`;
  } else if (effect === 'lift') {
    res.textShadow = `rgba(0, 0, 0, ${
      0.05 + (settings?.intensity || 0) * 0.005
    }) 0px ${Math.max(0.45, fontSize * 0.05)}px ${
      Math.max(0.45, fontSize * 0.05) + (settings?.intensity || 0) * 0.065
    }px; filter: opacity(1)`;
  } else if (effect === 'hollow') {
    res.caretColor = textColor;
    res.WebkitTextFillColor = 'transparent';
    res.WebkitTextStroke = `${
      (0.0091666 + 0.000833325 * (settings?.thickness || 0)) * fontSize
    }px ${textColor}`;
  } else if (effect === 'splice') {
    res.caretColor = textColor;
    res.WebkitTextFillColor = 'transparent';
    const thickness = settings?.thickness || 0;
    res.WebkitTextStroke = `${
      Math.max(8, fontSize) * 0.00916666 +
      (0.00166666 / 2) * fontSize * thickness
    }px ${textColor}`;
    const radians = ((settings?.direction || 0) * Math.PI) / 180;
    const x =
      (settings?.offset || 0) * 0.00183334 * fontSize * Math.sin(radians);
    const y =
      (settings?.offset || 0) * 0.00183334 * fontSize * Math.cos(radians);
    res.textShadow = `${settings.color} ${x}px ${y}px 0px`;
  } else if (effect === 'outline') {
    /*
        res.WebkitTextStroke = `${
            0.0183334 * fontSize + 0.0016666 * fontSize * (settings?.thickness || 0)
        }px ${settings?.color}`;*/
    //TODO need duplicate element
  } else if (effect === 'echo') {
    const color = new Color(settings.color as string);
    const radians = ((settings?.direction || 0) * Math.PI) / 180;

    const x =
      (settings?.offset || 0) * 0.00166666 * fontSize * Math.sin(radians);
    const y =
      (settings?.offset || 0) * 0.00166666 * fontSize * Math.cos(radians);
    res.textShadow = `${color
      .alpha(0.5)
      .toRgbString()} ${x}px ${y}px 0px, ${color.alpha(0.3).toRgbString()} ${
      x * 2
    }px ${y * 2}px 0px`;
  } else if (effect === 'neon') {
    /*
    const color = Color(textColor);
    const intensity = settings?.intensity || 0;
    const textColor = newShade(color.hex().toString(), intensity / 100);
    const size = 0.016766 * fontSize + 0.001004 * (settings?.intensity || 0) - 0.001004;

    const shadowColor = color.isLight()
        ? color.darken(Math.min(Math.max(2, 100 - color.lightness()), 10) * 0.02).rgb()
        : color.lighten(Math.min(Math.max(2, color.lightness()), 10) * 0.02).rgb();
    const blurShadowColor = color.isLight()
        ? color.darken(Math.min(Math.max(2, 100 - color.lightness()), 10) * 0.01).rgb()
        : color.lighten(Math.min(Math.max(2, color.lightness()), 10) * 0.01).rgb();
    res.filter = `drop-shadow(${shadowColor.alpha(0.95)} 0px 0px ${size}px) drop-shadow(${blurShadowColor.alpha(
        0.75,
    )} 0px 0px ${size * 5}px) drop-shadow(${blurShadowColor.alpha(0.44)} 0px 0px ${size * 15}px)`;
    res['--color-override'] = textColor.toString();
    res['span'] = {
        color: 'var(--color-override)!important',
    };*/
  }
  return res;
};
