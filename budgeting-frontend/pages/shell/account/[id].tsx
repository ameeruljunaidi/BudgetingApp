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

const AccountPage: NextPageWithLayout = () => {
  const router = useRouter();
  const accountId = router.query.id as string;
  const user = useContext(UserContext);

  const { data: transactionsData, loading: transactionsLoading } = useQuery(GET_TRANSACTIONS_FROM_ACCOUNT, {
    variables: { accountId },
    skip: !accountId,
    onError: (error) => {
      console.error(error.graphQLErrors[0].message);
      void router.push("/unauthenticated");
    },
  });

  if (!user) return null;

  const account = user.accounts.find((account) => account?._id === accountId);
  if (!account) return null;

  const transactions: Transaction[] = transactionsData?.getTransactionsFromAccount ?? [];

  const sortedTransactions: Transaction[] = [...transactions].sort((a, b) => {
    const first = new Date(Date.parse(a.date));
    const second = new Date(Date.parse(b.date));

    return second.getTime() - first.getTime();
  });

  return (
    <>
      <AccountDetail account={account} transactions={sortedTransactions} />
      <Space h={8} />
      <TransactionsHeader account={account} />
      <Space h={8} />
      <TransactionsTable
        loading={transactionsLoading}
        transactions={sortedTransactions}
        accountCurrency={account.currency}
      />
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
