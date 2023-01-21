import type { ReactElement } from "react";
import Shell from "../../layouts/shell";
import type { NextPageWithLayout } from "../_app";

const Home: NextPageWithLayout = () => {
  return <div>Shell Home</div>;
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Shell>{page}</Shell>;
};

export default Home;
