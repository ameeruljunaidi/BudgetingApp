import { useQuery } from "@apollo/client";
import { Loader } from "@mantine/core";
import type { ReactElement } from "react";
import { useContext } from "react";
import ClientOnly from "../../components/client-only";
import Shell, { UserContext } from "../../layouts/shell";
import GET_ME from "../../graphql/queries/get-me";
import type { NextPageWithLayout } from "../_app";

const Page: NextPageWithLayout = () => {
  const user = useContext(UserContext);

  return <div>{JSON.stringify(user)}</div>;
};

const User: NextPageWithLayout = () => {
  return (
    <ClientOnly>
      <Page />
    </ClientOnly>
  );
};

User.getLayout = function getLayout(page: ReactElement) {
  return <Shell>{page}</Shell>;
};

export default User;
