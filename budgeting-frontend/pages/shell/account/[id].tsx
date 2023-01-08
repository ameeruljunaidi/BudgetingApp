import { useQuery } from "@apollo/client";
import { Center, Container, Loader, Paper, Space, Text } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { useRouter } from "next/router";
import { ReactElement, useContext } from "react";
import Shell from "../../../layouts/shell";
import GET_TRANSACTIONS_FROM_ACCOUNT from "../../../graphql/queries/get-transactions-from-account";
import type { NextPageWithLayout } from "../../_app";
import { UserContext } from "../../../layouts/shell";
import TransactionsTable from "../../../components/transactions-table";
import { Transaction } from "../../../graphql/__generated__/graphql";
import TransactionsHeader from "../../../components/transaction-header";

const AccountPage: NextPageWithLayout = () => {
  const router = useRouter();
  const accountId = router.query.id as string;
  const { height, width } = useViewportSize();
  const user = useContext(UserContext);

  const { data, loading, error } = useQuery(GET_TRANSACTIONS_FROM_ACCOUNT, {
    variables: { accountId },
    skip: !accountId,
  });

  if (!user) {
    return (
      <Center h={height} w={width}>
        <Text>User not found</Text>
      </Center>
    );
  }

  const account = user.accounts.find(account => account?._id === accountId);

  if (loading) {
    return (
      <Center h={height} w={width}>
        <Loader />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h={height} w={width}>
        <Text>Account not found. {error.graphQLErrors[0].message}</Text>
      </Center>
    );
  }

  const transactions: Transaction[] = data?.getTransactionsFromAccount ?? [];

  return (
    <Container>
      <Paper bg="white" p="xs" withBorder>
        <Text size="lg" weight={700}>
          {account?.name}
        </Text>
        <Text size="sm">Currency: {account?.currency}</Text>
        <Text size="sm">
          Balance: {account?.balance.toLocaleString("en-US", { style: "currency", currency: "USD" })}
        </Text>
      </Paper>
      <Space h={8} />
      <TransactionsHeader accountId={accountId} />
      <Space h={8} />
      <TransactionsTable transactions={transactions} />
    </Container>
  );
};

AccountPage.getLayout = function getLayout(page: ReactElement) {
  return <Shell>{page}</Shell>;
};

export default AccountPage;