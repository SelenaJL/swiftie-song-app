// frontend/src/utils/colorUtils.js

const colorMap = {
  "teal": "#e0f2f2",
  "yellow": "#fffacd",
  "purple": "#e6e6fa",
  "red": "#ffe0e0",
  "light blue": "#e0f2ff",
  "black": "#e0e0e0", // Pale black is light grey
  "pink": "#ffe0f0",
  "grey": "#f0f0f0",
  "tan": "#f5f5dc",
  "dark blue": "#e0e0ff",
  "white": "#ffffff",
};

export const getPaleColor = (colorName) => {
  return colorMap[colorName.toLowerCase()] || "#ffffff";
};