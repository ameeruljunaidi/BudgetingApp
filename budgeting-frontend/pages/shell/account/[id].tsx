import { useQuery } from "@apollo/client";
import { Center, Loader, Space } from "@mantine/core";
import { useRouter } from "next/router";
import { ReactElement, useContext } from "react";
import Shell, { UserContext } from "../../../layouts/shell";
import GET_TRANSACTIONS_FROM_ACCOUNT from "../../../graphql/queries/get-transactions-from-account";
import type { NextPageWithLayout } from "../../_app";
import TransactionsTable from "../../../components/transaction/table";
import { Transaction } from "../../../graphql/__generated__/graphql";
import TransactionsHeader from "../../../components/transaction/header";
import AccountDetail from "../../../components/account/account-detail";
import GET_TRANSACTIONS_PAGINATED from "../../../graphql/queries/get-transactions-paginated";

const AccountPage: NextPageWithLayout = () => {
  const router = useRouter();
  const accountId = router.query.id as string;
  const user = useContext(UserContext);

  const { data: transactionsData, loading: transactionsLoading } = useQuery(GET_TRANSACTIONS_PAGINATED, {
    variables: { accountId, take: 200, skip: 0 },
    skip: !accountId,
    onError: (error) => {
      console.error(error.graphQLErrors[0].message);
      void router.push("/unauthenticated");
    },
  });

  if (!user) return null;

  const account = user.accounts.find((account) => account?._id === accountId);
  if (!account) return null;

  const transactions: Transaction[] = transactionsData?.getTransactionsFromAccountPaginated.items ?? [];

  return (
    <>
      <AccountDetail account={account} transactions={transactions} />
      <Space h={8} />
      <TransactionsHeader account={account} />
      <Space h={8} />
      <TransactionsTable loading={transactionsLoading} transactions={transactions} account={account} />
      {transactionsLoading && (
        <Center p={24}>
          <Loader variant="dots" color="black" />
        </Center>
      )}
    </>
  );
};

AccountPage.getLayout = function getLayout(page: ReactElement) {
  return <Shell>{page}</Shell>;
};

export default AccountPage;
