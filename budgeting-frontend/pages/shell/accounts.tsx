import { useQuery } from "@apollo/client";
import { Loader } from "@mantine/core";
import type { ReactElement } from "react";
import ClientOnly from "../../components/client-only";
import Shell from "../../layouts/shell";
import GET_ME from "../../graphql/queries/get-me";
import type { NextPageWithLayout } from "../_app";

const Page: NextPageWithLayout = () => {
  const { data, loading, error } = useQuery(GET_ME);

  if (loading) return <Loader />;
  if (error) return <div>Error: ${error.graphQLErrors[0].message}</div>;

  return <div>{JSON.stringify(data?.me?.accounts)}</div>;
};

const Accounts: NextPageWithLayout = () => {
  return <Page />;
};

Accounts.getLayout = function getLayout(page: ReactElement) {
  return <Shell>{page}</Shell>;
};

export default Accounts;
