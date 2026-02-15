import { createTheme } from "@mantine/core";

export const theme = createTheme({
  colorScheme: "dark",
  /** Primary brand color */
  primaryColor: "teal",

  colors: {
    erpGray: [
      "#f8f9fa",
      "#f1f3f5",
      "#e9ecef",
      "#dee2e6",
      "#ced4da",
      "#adb5bd",
      "#868e96",
      "#495057",
      "#343a40",
      "#212529",
    ],
  },

  /** Global border radius */
  defaultRadius: "sm",

  /** Typography */
  fontFamily: "Inter, system-ui, sans-serif",
  headings: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontWeight: "600",
  },

  /** Spacing scale */
  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
});
