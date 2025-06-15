import { Font } from "@react-pdf/renderer";

Font.register({
  family: "Lora",
  fonts: [
    { src: "/fonts/Lora/Lora-Regular.ttf" }, // fontWeight: 400
    { src: "/fonts/Lora/Lora-Bold.ttf", fontWeight: 700 },
    { src: "/fonts/Lora/Lora-Italic.ttf", fontStyle: "italic" },
    {
      src: "/fonts/Lora/Lora-BoldItalic.ttf",
      fontWeight: 700,
      fontStyle: "italic",
    },
  ],
});

