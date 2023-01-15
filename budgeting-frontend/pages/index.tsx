import { ReactElement } from "react";
import Landing from "../components/landing";
import type { NextPageWithLayout } from "./_app";
import { createStyles } from "@mantine/core";

const useStyles = createStyles(() => ({
  flex: {
    display: "flex",
    height: "200px",
    width: "200px",
    backgroundColor: "rgb(173,43,43)",
    color: "white",
    fontSize: "xxx-large",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const Index: NextPageWithLayout = () => {
  const { classes } = useStyles();

  return <div className={classes.flex}>test</div>;
};

Index.getLayout = function getLayout(page: ReactElement) {
  return <Landing>{page}</Landing>;
};

export default Index;
