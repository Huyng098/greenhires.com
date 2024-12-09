import { normalizeNumber } from '@lidojs/design-core';

export const getCirclePath = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const d = (4 * (Math.sqrt(2) - 1)) / 3;
  const halfWidth = normalizeNumber(width / 2);
  const halfHeight = normalizeNumber(height / 2);
  const clipWidth = normalizeNumber(width * d);
  const clipHeight = normalizeNumber(height * d);
  const clipWValue = normalizeNumber((width - clipWidth) / 2);
  const clipHValue = normalizeNumber((height - clipHeight) / 2);
  const path = [`M ${halfWidth} 0`];
  path.push(
    `C ${width - clipWValue} 0 ${width} ${clipHValue} ${width} ${halfHeight}`
  );
  path.push(
    `C ${width} ${height - clipHValue} ${
      width - clipWValue
    } ${height} ${halfWidth} ${height}`
  );
  path.push(
    `C ${clipWValue} ${height} 0 ${height - clipHValue} 0 ${halfHeight}`
  );
  path.push(`C 0 ${clipHValue} ${clipWValue} 0 ${halfWidth} 0`);
  return path.join(' ');
};
