import { normalizeNumber } from '@lidojs/design-core';

export const getRectanglePath = ({
  width,
  height,
  roundedCorners,
}: {
  width: number;
  height: number;
  roundedCorners: number;
}) => {
  const roundedValue = normalizeNumber(
    Math.min(Math.min(width / 2, ((roundedCorners / 100) * 64) / 2), height / 2)
  );
  const d = (4 * (Math.sqrt(2) - 1)) / 3;
  const clipValue = normalizeNumber(roundedValue * (1 - d));
  const path = [`M ${roundedValue} 0`];
  path.push(`L ${normalizeNumber(width) - roundedValue} 0`);
  if (roundedCorners) {
    //C x1, y1, x2, y2, x, y
    path.push(
      `C ${normalizeNumber(width) - clipValue} 0 ${normalizeNumber(
        width
      )} ${clipValue} ${normalizeNumber(width)} ${roundedValue}`
    );
  }
  path.push(
    `L ${normalizeNumber(width)} ${normalizeNumber(height) - roundedValue}`
  );
  if (roundedCorners) {
    //x1, y1
    path.push(
      `C ${normalizeNumber(width)} ${normalizeNumber(height) - clipValue} ${
        normalizeNumber(width) - clipValue
      } ${normalizeNumber(height)} ${
        normalizeNumber(width) - roundedValue
      } ${normalizeNumber(height)}`
    );
  }
  path.push(`L ${roundedValue} ${normalizeNumber(height)}`);
  if (roundedCorners) {
    path.push(
      `C ${clipValue} ${normalizeNumber(height)} 0 ${
        normalizeNumber(height) - clipValue
      } 0 ${normalizeNumber(height) - roundedValue}`
    );
  }
  path.push(`L 0 ${roundedValue}`);
  if (roundedCorners) {
    path.push(`C 0 ${clipValue} ${clipValue} 0 ${roundedValue} 0`);
  }
  return path.join(' ');
};
