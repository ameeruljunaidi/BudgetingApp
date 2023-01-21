import { ActionIcon, Button, Container, Flex, Group, Paper, Text } from "@mantine/core";
import { openContextModal } from "@mantine/modals";
import { Account, Transaction } from "../../graphql/__generated__/graphql";
import { useRouter } from "next/router";
import { FETCH_CACHE_HEADER } from "next/dist/client/components/app-router-headers";
import { IconEdit } from "@tabler/icons";

type AccountDetailProp = {
  account: Account;
  transactions: Transaction[];
};

export default function AccountDetail({ account, transactions }: AccountDetailProp) {
  const router = useRouter();
  const accountId = router.query.id as string;

  const clearedBalance = transactions
    .filter((transaction) => transaction.cleared)
    .reduce((total, transaction) => total + transaction.transactionDetails[0].amount, 0);

  return (
    <Paper bg="white" withBorder>
      <Group position="apart" grow px="md" py="sm">
        <Container p={0}>
          <Flex gap="xs" align="center">
            <Text size="lg" weight={700}>
              {account?.name}
            </Text>
            <ActionIcon
              onClick={() => {
                openContextModal({
                  modal: "editAccount",
                  title: "Edit Account",
                  innerProps: { account },
                  centered: true,
                });
              }}
            >
              <IconEdit />
            </ActionIcon>
          </Flex>
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
              {account?.reconciledBalance.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Text>
            <Text size="sm">
              Last reconciled: {new Date(Date.parse(account?.lastReconciled)).toLocaleDateString("en-GB")}
            </Text>
            <Text size="sm">
              Cleared Balance:{" "}
              {clearedBalance.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Text>
          </Container>
          <Button
            bg="black"
            onClick={() => {
              openContextModal({
                modal: "reconcileAccount",
                title: "Reconcile Account",
                innerProps: { accountId, transactions },
              });
            }}
          >
            Reconcile
          </Button>
        </Flex>
      </Group>
    </Paper>
  );
}
