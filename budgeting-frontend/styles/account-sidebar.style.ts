import { createStyles } from "@mantine/core";

const sidebarStyles = createStyles((theme, _params) => {
  return {
    linkActive: {
      "&, &:hover": {
        backgroundColor: theme.fn.variant({ variant: "light", color: theme.primaryColor }).background,
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor }).color,
      },
    },
    collapsible: {
      fontWeight: 500,
      display: "flex",
      textDecoration: "none",
      padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
      paddingLeft: `${theme.spacing.xs}`,
      paddingRight: `${theme.spacing.xs}`,
      fontSize: theme.fontSizes.sm,
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
      borderLeft: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`,
      alignItems: "center",
      justifyContent: "space-between",

      "&:hover": {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0],
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
      },
    },
  };
});

export default sidebarStyles;
