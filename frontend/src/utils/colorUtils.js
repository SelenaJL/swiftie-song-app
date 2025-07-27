// frontend/src/utils/colorUtils.js

const colorMap = {
  "green": "#d9f7d9",
  "yellow": "#fffacd",
  "purple": "#e6e6fa",
  "red": "#ffe0e0",
  "light blue": "#e0f2ff",
  "black": "#e0e0e0", // Pale black is light grey
  "pink": "#ffe0f0",
  "grey": "#f0f0f0",
  "tan": "#fff1d9ff",
  "dark blue": "#e0e0ff",
  "white": "#fffcf3ff",
};

export const getPaleColor = (colorName) => {
  return colorMap[colorName.toLowerCase()] || "#ffffff";
};