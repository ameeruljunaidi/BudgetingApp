import { LoadingOverlay } from "@mantine/core";
import { ReactElement, useState } from "react";
import Landing from "../components/landing";
import type { NextPageWithLayout } from "./_app";

const Index: NextPageWithLayout = () => {
  return (
    <>
      <LoadingOverlay visible={true} overlayBlur={2} />
      <div>This is a test</div>
    </>
  );
  // return <div>Landing Page</div>;
};

Index.getLayout = function getLayout(page: ReactElement) {
  return <Landing>{page}</Landing>;
};

export default Index;
