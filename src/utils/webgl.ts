
export const hexToShaderVec3 = (hex: string, precision: number = 4) => {
  // remove the hash if present
  hex = hex.replace(/^#/, '');

  let r, g, b;

  // if only 3 character format
  if (hex.length === 3) {
    const old = hex;
    r = parseInt(old[0].repeat(2), 16);
    g = parseInt(old[1].repeat(2), 16);
    b = parseInt(old[2].repeat(2), 16);
  }
  else if (hex.length === 6) {
    // parse hex values to integers
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }
  else {
    throw new Error(`Unknown hex color format ('${hex}').`);
  }

  // normalize to 0.0 - 1.0 range and round for clean shader floats
  return [
    parseFloat((r / 255).toFixed(precision)),
    parseFloat((g / 255).toFixed(precision)),
    parseFloat((b / 255).toFixed(precision)),
  ];
};

export const hexToShaderVec4 = (hex: string, precision: number = 4) => {
  // remove the hash if present
  hex = hex.replace(/^#/, '');

  let r, g, b, a;

  // if only 3 character format
  if (hex.length === 3) {
    const old = hex;
    r = parseInt(old[0].repeat(2), 16);
    g = parseInt(old[1].repeat(2), 16);
    b = parseInt(old[2].repeat(2), 16);
    a = 255;
  }
  else if ([6, 8].includes(hex.length)) {
    // default alpha to 255 (1.0) if not provided
    if (hex.length === 6) {
      hex += 'ff';
    }

    // parse hex values to integers
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
    a = parseInt(hex.substring(6, 8), 16);
  }
  else {
    throw new Error(`Unknown hex color format ('${hex}').`);
  }

  // normalize to 0.0 - 1.0 range and round for clean shader floats
  return [
    parseFloat((r / 255).toFixed(precision)),
    parseFloat((g / 255).toFixed(precision)),
    parseFloat((b / 255).toFixed(precision)),
    parseFloat((a / 255).toFixed(precision)),
  ];
};
