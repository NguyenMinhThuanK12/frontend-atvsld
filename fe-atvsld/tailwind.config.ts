import { Widgets } from "@mui/icons-material";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*/*/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./*/*/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        leftSidebar: "#14317f",
        primary: "#2962FF",
      },
      padding: {
        "84": "21rem",
        "86": "21.5rem",
        "88": "22rem",
        "90": "22.5rem",
      },
      width: {
        "84": "21rem",
        "86": "21.5rem",
        "88": "22rem",
        "90": "22.5rem",
      },
    },
  },
  plugins: [],
};

