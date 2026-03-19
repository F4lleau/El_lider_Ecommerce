import { createTheme } from "@mui/material/styles";

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: "#2563eb",
    },
    secondary: {
      main: "#10b981",
    },
    background: {
      default: "#f8fafc",
    },
  },
  shape: {
    borderRadius: 12,
  },
});
