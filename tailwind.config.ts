import { nextui } from "@nextui-org/react";
const {
  iconsPlugin,
  getIconCollections,
} = require("@egoist/tailwindcss-icons");

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        blue: "#1b76cf",
        secondary: "#e51510",
        primary: "#fcc300",
        success: "#4caf50",
        gray: "#999999",
        danger: "#f44336",
        light: "#f2f2f2",
        dark: "#2b2b2b",
        "success-light": "#DAF5E0",
        "success-dark": "#0A5028",
        "warning-light": "#FEEDD7",
        "warning-dark": "#62410F",
        "danger-light": "#FFD5E0",
        "danger-dark": "#600826",
        "info-light": "#D6E4FF",
        "info-dark": "#0A2C50",
      },
    },
  },
  plugins: [
    nextui(),
    iconsPlugin({
      collections: getIconCollections(["mdi", "ep", "ion", "material-symbols", "ph"]),
    }),
  ],
  darkMode: "class",
};
export default config;
