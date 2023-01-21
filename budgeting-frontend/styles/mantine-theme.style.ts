import { MantineThemeOverride } from "@mantine/core";

const mantineTheme: MantineThemeOverride = {
  colorScheme: "light",
  fontFamily: "Helvetica",
  fontSizes: { xs: 11, sm: 13, md: 16, lg: 17, xl: 18 },
  spacing: { xs: 8, sm: 12, md: 24, lg: 32, xl: 48 },
  breakpoints: { xs: 500, sm: 800, md: 1000, lg: 1200, xl: 1400 },
};

export default mantineTheme;
