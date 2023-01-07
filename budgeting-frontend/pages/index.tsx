import type { ReactElement } from "react";
import Landing from "../components/landing";
import type { NextPageWithLayout } from "./_app";

const Index: NextPageWithLayout = () => {
    return <div>Landing Page</div>;
};

Index.getLayout = function getLayout(page: ReactElement) {
    return <Landing>{page}</Landing>;
};

export default Index;
