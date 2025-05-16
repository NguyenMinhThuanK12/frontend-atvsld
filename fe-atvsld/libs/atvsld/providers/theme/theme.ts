
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2962FF", // Khớp với màu primary trong tailwind.config.js
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif", // Hoặc dùng font từ geist nếu cần
  },
});

export default theme;