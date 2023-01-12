import { useMutation, useQuery } from "@apollo/client";
import { Button, Center, Container, Flex, Group, Loader, Paper, Space, Text } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { useRouter } from "next/router";
import { ReactElement, useContext } from "react";
import Shell from "../../../layouts/shell";
import GET_TRANSACTIONS_FROM_ACCOUNT from "../../../graphql/queries/get-transactions-from-account";
import type { NextPageWithLayout } from "../../_app";
import { UserContext } from "../../../layouts/shell";
import TransactionsTable from "../../../components/account/transactions-table";
import { Transaction } from "../../../graphql/__generated__/graphql";
import TransactionsHeader from "../../../components/account/transaction-header";
import { openContextModal } from "@mantine/modals";

const AccountPage: NextPageWithLayout = () => {
  const router = useRouter();
  const accountId = router.query.id as string;
  const { height, width } = useViewportSize();
  const user = useContext(UserContext);

  const {
    data: transactionsData,
    loading: transactionsLoading,
    error: transactionsError,
  } = useQuery(GET_TRANSACTIONS_FROM_ACCOUNT, {
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

  if (!transactionsData) {
    return (
      <Center h={height} w={width}>
        <Loader />
      </Center>
    );
  }

  if (transactionsError) {
    return (
      <Center h={height} w={width}>
        <Text>Account not found. {transactionsError.graphQLErrors[0].message}</Text>
      </Center>
    );
  }

  const transactions: Transaction[] = transactionsData?.getTransactionsFromAccount ?? [];

  const reconcileAccount = (accountId: string) => {
    openContextModal({
      modal: "reconcileAccount",
      title: "Reconcile Account",
      innerProps: {
        accountId: accountId,
      },
    });
  };

  return (
    <Container>
      <Paper bg="white" p="xs" withBorder>
        <Group position="apart" grow>
          <Container>
            <Text size="lg" weight={700}>
              {account?.name}
            </Text>
            <Text size="sm">Currency: {account?.currency}</Text>
            <Text size="sm">
              Balance: {account?.balance.toLocaleString("en-US", { style: "currency", currency: "USD" })}
            </Text>
          </Container>
          <Flex justify="center" align="center">
            <Container>
              <Text size="sm">Account Reconciled: {account?.reconciled ? "Yes" : "No"}</Text>
              <Text size="sm">
                Reconciled Balance:{" "}
                {account?.reconciledBalance.toLocaleString("en-US", { style: "currency", currency: "USD" })}
              </Text>
              <Text size="sm">
                Last reconciled: {new Date(Date.parse(account?.lastReconciled)).toLocaleDateString("en-GB")}
              </Text>
            </Container>
            <Button bg="black" onClick={() => reconcileAccount(accountId)}>
              Reconcile
            </Button>
          </Flex>
        </Group>
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
