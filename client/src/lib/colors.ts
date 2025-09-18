// Taken from: https://stackoverflow.com/a/1636354/17456270
export const HEX_COLOR_REGEX = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

const hexToRGB = (hexColor: string) => {
  if (!hexColor.match(HEX_COLOR_REGEX))
    throw new Error("Invalid input: expected hex color");
  const color = hexColor.substring(1, 7);

  const red = parseInt(color.substring(0, 2), 16);
  const green = parseInt(color.substring(2, 4), 16);
  const blue = parseInt(color.substring(4, 6), 16);
  return [red / 255, green / 255, blue / 255] as const;
};

// The magic values and math come from this https://stackoverflow.com/a/3943023/17456270 (and by extension, from W3C recommendations)
const computeLuminance = (rgb: readonly [number, number, number]) => {
  const [r, g, b] = rgb.map((color) => {
    if (color <= 0.04045) {
      return color / 12.92;
    }
    return Math.pow((color + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
};

export const isColorDark = (hexColor: string) => {
  const rgb = hexToRGB(hexColor);
  const luminance = computeLuminance(rgb);

  return luminance <= 0.179;
};
