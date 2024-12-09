// TODO: need to validate min size before using this
export const getChatBubbleSquarePath = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const paddingBottom = 14.8;
  const paddingLeft = 12.4;
  const arrowSize = 23.6;
  const path = [`M 0 0`];
  path.push(`L ${width} 0`);
  path.push(`L ${width} ${height - paddingBottom}`);
  path.push(`L ${paddingLeft + arrowSize} ${height - paddingBottom}`);
  path.push(`L ${paddingLeft} ${height}`);
  path.push(`L ${paddingLeft} ${height - paddingBottom}`);
  path.push(`L 0 ${height - paddingBottom}`);
  path.push(`L 0 0`);
  return path.join(' ');
};

export const getChatBubbleRoundPath = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const paddingBottom = 9;
  const paddingLeft = 12.4;
  const arrowSize = 14;
  const roundedValue = Math.min(width / 2, 22);
  const d = (4 * (Math.sqrt(2) - 1)) / 3;
  const clipValue = roundedValue * (1 - d);
  const path = [`M ${roundedValue} 0`];
  path.push(`L ${width - roundedValue} 0`);
  path.push(
    `C ${width - clipValue} 0 ${width} ${clipValue} ${width} ${
      (height - paddingBottom) / 2
    }`
  );
  path.push(
    `C ${width} ${(height - paddingBottom) / 2 + clipValue} ${
      width - clipValue
    } ${height - paddingBottom} ${width - roundedValue} ${
      height - paddingBottom
    }`
  );
  path.push(`L ${paddingLeft + arrowSize} ${height - paddingBottom}`);
  path.push(`L ${paddingLeft} ${height}`);
  path.push(`L ${paddingLeft} ${height - paddingBottom - 2}`);
  path.push(
    `C ${paddingLeft / 2} ${height - paddingBottom - 5} 0 ${
      height - paddingBottom - clipValue
    } 0 ${(height - paddingBottom) / 2}`
  );
  path.push(`C 0 ${clipValue} ${clipValue} 0 ${roundedValue} 0`);
  return path.join(' ');
};
